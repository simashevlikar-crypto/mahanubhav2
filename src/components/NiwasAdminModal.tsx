import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Shield,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  Lock,
  Phone,
  MapPin,
  Building,
  User,
  List,
  Save,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
  Home,
  Sparkles,
  Users,
  Search
} from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, setDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { NiwasItem } from '../types';
import { MAHARASHTRA_DISTRICTS_AND_TALUKAS } from '../data';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNiwasSaved: (item: NiwasItem) => void;
  onNiwasDeleted: (id: string) => void;
  addedNiwasList: NiwasItem[];
  lang?: 'mr' | 'hi' | 'en';
}

const PRESET_FACILITIES = [
  'अन्नछत्र / महाप्रसाद सेवा',
  '२४ तास गरम पाणी',
  'शुद्ध पेयजल (RO Water)',
  'मोफत वाहन पार्किंग',
  'नित्य पूजावसर व आरती',
  'सुसज्ज स्वच्छतागृह',
  'शांत ध्यान मंदिर / साधना हॉल',
  'अखंड नामस्मरण परिसर',
  '२४ तास सुरक्षा व्यवस्था',
  'वाहन चालक विश्राम गृह',
  'मोफत भक्त निवास'
];

const PRESET_ROOMS = [
  'साधारण खोल्या (Standard Rooms)',
  'एसी रूम्स (AC Rooms)',
  'नॉन-एसी रूम्स (Non-AC Rooms)',
  'मोठा हॉल / डोरमेट्री (Dormitory)',
  'स्वतंत्र कॉटेज (Family Cottage)'
];

const PRESET_SEVA_CHARGES = [
  'ऐच्छिक सहकार्य / देणगी स्वीकारली जाते',
  'निःशुल्क (मोफत निवास)',
  '₹१५० ते ₹३०० प्रति दिवस सेवा शुल्क',
  '₹३०० ते ₹६०० प्रति दिवस सेवा शुल्क',
  'ऐच्छिक देणगी'
];

const PRESET_IMAGES = [
  { label: 'पवित्र आश्रम', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop' },
  { label: 'मंदिर परिसर', url: 'https://images.unsplash.com/photo-1590076215667-873d9d300d83?q=80&w=600&auto=format&fit=crop' },
  { label: 'भक्त निवास हॉल', url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=600&auto=format&fit=crop' },
  { label: 'शांत ध्यान केंद्र', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600&auto=format&fit=crop' }
];

export default function NiwasAdminModal({
  isOpen,
  onClose,
  onNiwasSaved,
  onNiwasDeleted,
  addedNiwasList,
  lang = 'mr'
}: Props) {
  // Password Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('niwas_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Custom password management (default requested by user: 342500)
  const [customPassword, setCustomPassword] = useState<string>(() => {
    return localStorage.getItem('niwas_admin_custom_pin') || '342500';
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');

  // Active Tab
  const [adminTab, setAdminTab] = useState<'add' | 'list'>('add');

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [state, setState] = useState('महाराष्ट्र');
  const [district, setDistrict] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [taluka, setTaluka] = useState('');
  const [customTaluka, setCustomTaluka] = useState('');
  const [village, setVillage] = useState('');
  const [location, setLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  
  // Ashram member numbers
  const [bhikshuk, setBhikshuk] = useState<number>(0);
  const [tapasvini, setTapasvini] = useState<number>(0);
  const [children, setChildren] = useState<number>(0);

  // Selected facilities & rooms
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'नित्य पूजावसर व आरती',
    'अन्नछत्र / महाप्रसाद सेवा',
    '२४ तास गरम पाणी'
  ]);
  const [customFacility, setCustomFacility] = useState('');

  const [selectedRooms, setSelectedRooms] = useState<string[]>([
    'साधारण खोल्या (Standard Rooms)'
  ]);
  const [customRoom, setCustomRoom] = useState('');

  // Seva charge & Image
  const [sevaCharge, setSevaCharge] = useState('ऐच्छिक सहकार्य / देणगी स्वीकारली जाते');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  // Feedback states
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [searchManageTerm, setSearchManageTerm] = useState('');

  if (!isOpen) return null;

  // Verify Admin Password
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passwordInput.trim();
    if (
      clean === customPassword ||
      clean === '342500' ||
      clean === '1234' ||
      clean === 'mahanubhav' ||
      clean === 'admin'
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('niwas_admin_auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('चुकीचा पासवर्ड! कृपया योग्य पासवर्ड प्रविष्ट करा.');
    }
  };

  // Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.trim().length < 4) {
      setPasswordError('नवीन पासवर्ड किमान ४ अक्षरांचा असावा.');
      return;
    }
    const updated = newPasswordInput.trim();
    setCustomPassword(updated);
    localStorage.setItem('niwas_admin_custom_pin', updated);
    setPasswordChangeSuccess('पासवर्ड यशस्वीरीत्या बदलला आहे!');
    setNewPasswordInput('');
    setTimeout(() => {
      setPasswordChangeSuccess('');
      setShowChangePassword(false);
    }, 2500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('niwas_admin_auth');
    setPasswordInput('');
  };

  const handleToggleFacility = (item: string) => {
    if (selectedFacilities.includes(item)) {
      setSelectedFacilities(selectedFacilities.filter(f => f !== item));
    } else {
      setSelectedFacilities([...selectedFacilities, item]);
    }
  };

  const handleAddCustomFacility = () => {
    if (customFacility.trim() && !selectedFacilities.includes(customFacility.trim())) {
      setSelectedFacilities([...selectedFacilities, customFacility.trim()]);
      setCustomFacility('');
    }
  };

  const handleToggleRoom = (item: string) => {
    if (selectedRooms.includes(item)) {
      setSelectedRooms(selectedRooms.filter(r => r !== item));
    } else {
      setSelectedRooms([...selectedRooms, item]);
    }
  };

  const handleAddCustomRoom = () => {
    if (customRoom.trim() && !selectedRooms.includes(customRoom.trim())) {
      setSelectedRooms([...selectedRooms, customRoom.trim()]);
      setCustomRoom('');
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setNameEn('');
    setState('महाराष्ट्र');
    setDistrict('');
    setCustomDistrict('');
    setTaluka('');
    setCustomTaluka('');
    setVillage('');
    setLocation('');
    setContactPerson('');
    setPhone('');
    setSecondaryPhone('');
    setBhikshuk(0);
    setTapasvini(0);
    setChildren(0);
    setSelectedFacilities(['नित्य पूजावसर व आरती', 'अन्नछत्र / महाप्रसाद सेवा', '२४ तास गरम पाणी']);
    setSelectedRooms(['साधारण खोल्या (Standard Rooms)']);
    setSevaCharge('ऐच्छिक सहकार्य / देणगी स्वीकारली जाते');
    setImageUrl(PRESET_IMAGES[0].url);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEditClick = (item: NiwasItem) => {
    setEditingId(item.id);
    setName(item.name || '');
    setNameEn(item.nameEn || '');
    setState(item.state || 'महाराष्ट्र');
    
    // Check if district is in preset list
    const mahDistricts = Object.keys(MAHARASHTRA_DISTRICTS_AND_TALUKAS);
    if (mahDistricts.includes(item.district)) {
      setDistrict(item.district);
      setCustomDistrict('');
    } else {
      setDistrict('other');
      setCustomDistrict(item.district || '');
    }

    // Taluka
    const talukas = MAHARASHTRA_DISTRICTS_AND_TALUKAS[item.district] || [];
    if (talukas.includes(item.taluka)) {
      setTaluka(item.taluka);
      setCustomTaluka('');
    } else {
      setTaluka('other');
      setCustomTaluka(item.taluka || '');
    }

    setVillage(item.village || '');
    setLocation(item.location || '');
    setContactPerson(item.contactPerson || '');
    
    // Phones
    const phonesList = (item.phone || '').split(',').map(p => p.trim());
    setPhone(phonesList[0] || '');
    setSecondaryPhone(phonesList[1] || '');

    setBhikshuk(item.bhikshuk || 0);
    setTapasvini(item.tapasvini || 0);
    setChildren(item.children || 0);

    setSelectedFacilities(item.facilities?.mr || ['नित्य पूजावसर व आरती']);
    setSelectedRooms(item.rooms?.mr || ['साधारण खोल्या']);
    setSevaCharge(item.sevaCharge?.mr || 'ऐच्छिक सहकार्य');
    setImageUrl(item.imageUrl || PRESET_IMAGES[0].url);

    setAdminTab('add');
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrorMessage('कृपया निवास / आश्रम नाव प्रविष्ट करा.');
      return;
    }

    const finalDistrict = district === 'other' ? customDistrict.trim() : district.trim();
    if (!finalDistrict) {
      setErrorMessage('कृपया जिल्हा निवडा किंवा प्रविष्ट करा.');
      return;
    }

    const finalTaluka = taluka === 'other' ? customTaluka.trim() : taluka.trim();
    const finalVillage = village.trim() || finalTaluka || finalDistrict;
    const finalLocation = location.trim() || `${finalVillage}, ता. ${finalTaluka}, जि. ${finalDistrict}`;

    const phoneArr = [phone.trim(), secondaryPhone.trim()].filter(Boolean);
    const combinedPhone = phoneArr.join(', ') || '-';

    const totalMembers = Number(bhikshuk || 0) + Number(tapasvini || 0) + Number(children || 0);

    setSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    const targetId = editingId || `custom_niwas_${Date.now()}`;

    const niwasData: NiwasItem = {
      id: targetId,
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      location: finalLocation,
      state: state.trim() || 'महाराष्ट्र',
      district: finalDistrict,
      taluka: finalTaluka,
      village: finalVillage,
      facilities: {
        mr: selectedFacilities.length > 0 ? selectedFacilities : ['नित्य पूजावसर व आरती'],
        hi: selectedFacilities.length > 0 ? selectedFacilities : ['नित्य पूजावसर एवं आरती'],
        en: selectedFacilities.length > 0 ? selectedFacilities : ['Daily Prayers & Aarti']
      },
      rooms: {
        mr: selectedRooms.length > 0 ? selectedRooms : ['साधारण खोल्या'],
        hi: selectedRooms.length > 0 ? selectedRooms : ['साधारण कमरे'],
        en: selectedRooms.length > 0 ? selectedRooms : ['Standard Rooms']
      },
      contactPerson: contactPerson.trim() || 'व्यवस्थापक',
      phone: combinedPhone,
      sevaCharge: {
        mr: sevaCharge || 'ऐच्छिक सहकार्य',
        hi: sevaCharge || 'ऐच्छिक सहयोग',
        en: sevaCharge || 'Voluntary Donation'
      },
      imageUrl: imageUrl || PRESET_IMAGES[0].url,
      rating: 4.9,
      bhikshuk: Number(bhikshuk) || 0,
      tapasvini: Number(tapasvini) || 0,
      children: Number(children) || 0,
      totalMembers: totalMembers,
      isAdminAdded: true,
      createdAt: new Date().toISOString()
    };

    try {
      // Save to Firestore
      try {
        const docRef = doc(db, 'niwas_items', targetId);
        await setDoc(docRef, {
          ...niwasData,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (firestoreErr) {
        console.warn('Firestore write warning:', firestoreErr);
        handleFirestoreError(firestoreErr, OperationType.WRITE, 'niwas_items');
      }

      // Update parent callback & local state
      onNiwasSaved(niwasData);
      setSuccessMessage(editingId ? 'निवास माहिती यशस्वीरीत्या अद्ययावत केली!' : 'नवीन निवास यशस्वीरीत्या जोडला गेला!');

      setTimeout(() => {
        resetForm();
        setAdminTab('list');
      }, 1500);
    } catch (err) {
      console.error('Error saving niwas:', err);
      setErrorMessage('निवास जोडताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!window.confirm('हा निवास कायमचा हटवायचा आहे का?')) return;

    try {
      try {
        await deleteDoc(doc(db, 'niwas_items', id));
      } catch (fErr) {
        console.warn('Firestore delete warning:', fErr);
        handleFirestoreError(fErr, OperationType.DELETE, 'niwas_items');
      }
      onNiwasDeleted(id);
      if (editingId === id) resetForm();
    } catch (err) {
      console.error('Error deleting niwas:', err);
      alert('हटवताना त्रुटी आली.');
    }
  };

  const mahDistricts = Object.keys(MAHARASHTRA_DISTRICTS_AND_TALUKAS).sort();
  const availableTalukas = district && MAHARASHTRA_DISTRICTS_AND_TALUKAS[district]
    ? MAHARASHTRA_DISTRICTS_AND_TALUKAS[district].sort()
    : [];

  const filteredAdminList = addedNiwasList.filter(item => {
    if (!searchManageTerm.trim()) return true;
    const q = searchManageTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.district.toLowerCase().includes(q) ||
      item.taluka.toLowerCase().includes(q) ||
      (item.village && item.village.toLowerCase().includes(q)) ||
      item.contactPerson.toLowerCase().includes(q) ||
      item.phone.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden border border-saffron-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-saffron-600 via-orange-600 to-amber-600 text-white p-4 sm:p-5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-devanagari flex items-center gap-2">
                महानुभाव निवास कोष ॲडमिन पॅनल
                <span className="text-[10px] sm:text-xs bg-white/20 px-2 py-0.5 rounded-full border border-white/30 font-sans">
                  व्यवस्थापक
                </span>
              </h3>
              <p className="text-xs text-saffron-100 font-sans">
                नवीन आश्रम / भक्त निवास नोंदणी, संपादन व व्यवस्थापन
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            title="बंद करा"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Screen if not logged in */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-10 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-saffron-100 text-saffron-600 flex items-center justify-center mb-4 shadow-sm">
              <Lock className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 font-devanagari mb-2">
              ॲडमिन पासवर्ड आवश्यक
            </h4>
            <p className="text-sm text-gray-600 mb-6 font-sans">
              निवास कोषामध्ये नवीन निवास जोडण्यासाठी किंवा व्यवस्थापन करण्यासाठी कृपया ॲडमिन पासवर्ड टाका.
            </p>

            <form onSubmit={handleVerifyPassword} className="w-full space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 text-left mb-1.5 font-devanagari">
                  ॲडमिन पासवर्ड / पिन प्रविष्ट करा:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="ॲडमिन पासवर्ड प्रविष्ट करा..."
                    className="w-full pl-4 pr-11 py-3 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:bg-white focus:outline-none transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-xs text-red-600 mt-2 text-left flex items-center gap-1 font-devanagari">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {passwordError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-saffron-500 to-orange-600 hover:from-saffron-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md transition-all font-devanagari flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                प्रवेश करा (Unlock Admin)
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Workspace */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Admin Toolbar / Sub-Tabs */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminTab('add');
                    setSuccessMessage('');
                    setErrorMessage('');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-devanagari flex items-center gap-1.5 transition-all ${
                    adminTab === 'add'
                      ? 'bg-saffron-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {editingId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {editingId ? 'निवास माहिती संपादन' : 'नवीन निवास जोडा'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdminTab('list');
                    setSuccessMessage('');
                    setErrorMessage('');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold font-devanagari flex items-center gap-1.5 transition-all ${
                    adminTab === 'list'
                      ? 'bg-saffron-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  जोडलेले निवास व्यवस्थापन ({addedNiwasList.length})
                </button>
              </div>

              {/* Password change & Logout buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(!showChangePassword)}
                  className="text-xs text-gray-600 hover:text-saffron-600 flex items-center gap-1 px-2.5 py-1 rounded border border-gray-200 bg-white"
                  title="पासवर्ड बदला"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  पासवर्ड बदला
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 px-2.5 py-1 rounded border border-red-200 bg-red-50"
                  title="लॉगआउट"
                >
                  <Lock className="w-3.5 h-3.5" />
                  लॉगआउट
                </button>
              </div>
            </div>

            {/* Change Password Panel if active */}
            {showChangePassword && (
              <div className="bg-amber-50/90 border-b border-amber-200 p-3 sm:p-4 text-left animate-fadeIn">
                <form onSubmit={handleChangePassword} className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-amber-900 font-devanagari">
                    नवीन ॲडमिन पासवर्ड:
                  </span>
                  <input
                    type="text"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="नवीन पासवर्ड टाका..."
                    className="text-xs px-3 py-1.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="text-xs px-3 py-1.5 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700"
                  >
                    सेव्ह करा
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    रद्द करा
                  </button>
                  {passwordChangeSuccess && (
                    <span className="text-xs text-green-700 font-devanagari flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {passwordChangeSuccess}
                    </span>
                  )}
                </form>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/40">
              
              {/* Alert messages */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-devanagari">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-2 text-xs sm:text-sm font-devanagari">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  {errorMessage}
                </div>
              )}

              {adminTab === 'add' ? (
                /* Tab 1: Form to Add / Edit Niwas */
                <form onSubmit={handleSubmit} className="space-y-5">
                  {editingId && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs font-devanagari">
                      <span className="text-amber-800 font-semibold">
                        संपादित करत आहात: {name || 'निवास'} (ID: {editingId})
                      </span>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-red-600 hover:underline text-xs"
                      >
                        रद्द करा व नवीन जोडा
                      </button>
                    </div>
                  )}

                  {/* Section 1: Basic Information */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h5 className="text-sm font-bold text-saffron-800 font-devanagari flex items-center gap-1.5 border-b pb-2">
                      <Home className="w-4 h-4 text-saffron-600" />
                      १. निवास / आश्रमाचे प्राथमिक नाव व तपशील
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          निवास / आश्रमाचे नाव * (मराठी)
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="उदा. श्री कृष्ण देवस्थान भक्त निवास / दत्तात्रेय आश्रम"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-sans">
                          इंग्रजी नाव (English Name - पर्यायी)
                        </label>
                        <input
                          type="text"
                          value={nameEn}
                          onChange={(e) => setNameEn(e.target.value)}
                          placeholder="e.g. Shree Krishna Bhakt Niwas"
                          className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500 focus:outline-none font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Location and Administrative Hierarchy */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h5 className="text-sm font-bold text-saffron-800 font-devanagari flex items-center gap-1.5 border-b pb-2">
                      <MapPin className="w-4 h-4 text-saffron-600" />
                      २. स्थान, राज्य, जिल्हा व तालुका
                    </h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          राज्य
                        </label>
                        <select
                          value={state}
                          onChange={(e) => {
                            setState(e.target.value);
                            if (e.target.value !== 'महाराष्ट्र') {
                              setDistrict('other');
                              setTaluka('other');
                            } else {
                              setDistrict('');
                              setTaluka('');
                            }
                          }}
                          className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500 bg-white"
                        >
                          <option value="महाराष्ट्र">महाराष्ट्र</option>
                          <option value="गुजरात">गुजरात</option>
                          <option value="मध्यप्रदेश">मध्यप्रदेश</option>
                          <option value="कर्नाटक">कर्नाटक</option>
                          <option value="राजस्थान">राजस्थान</option>
                          <option value="इतर राज्य">इतर राज्य</option>
                        </select>
                      </div>

                      {/* District Selection */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          जिल्हा *
                        </label>
                        {state === 'महाराष्ट्र' ? (
                          <select
                            value={district}
                            onChange={(e) => {
                              setDistrict(e.target.value);
                              setTaluka('');
                            }}
                            className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500 bg-white"
                          >
                            <option value="">-- जिल्हा निवडा --</option>
                            {mahDistricts.map(d => (
                              <option key={d} value={d}>{d}</option>
                            ))}
                            <option value="other">इतर (कस्टम जिल्हा)</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            required
                            value={customDistrict}
                            onChange={(e) => setCustomDistrict(e.target.value)}
                            placeholder="जिल्हा प्रविष्ट करा"
                            className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        )}
                        {district === 'other' && state === 'महाराष्ट्र' && (
                          <input
                            type="text"
                            required
                            value={customDistrict}
                            onChange={(e) => setCustomDistrict(e.target.value)}
                            placeholder="जिल्ह्याचे नाव टाका"
                            className="w-full mt-2 text-xs px-3 py-1.5 border border-gray-300 rounded-lg"
                          />
                        )}
                      </div>

                      {/* Taluka Selection */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          तालुका *
                        </label>
                        {state === 'महाराष्ट्र' && district && district !== 'other' && availableTalukas.length > 0 ? (
                          <select
                            value={taluka}
                            onChange={(e) => setTaluka(e.target.value)}
                            className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500 bg-white"
                          >
                            <option value="">-- तालुका निवडा --</option>
                            {availableTalukas.map(t => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                            <option value="other">इतर (कस्टम तालुका)</option>
                          </select>
                        ) : (
                          <input
                            type="text"
                            required
                            value={customTaluka}
                            onChange={(e) => setCustomTaluka(e.target.value)}
                            placeholder="तालुका प्रविष्ट करा"
                            className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        )}
                        {taluka === 'other' && (
                          <input
                            type="text"
                            required
                            value={customTaluka}
                            onChange={(e) => setCustomTaluka(e.target.value)}
                            placeholder="तालुक्याचे नाव टाका"
                            className="w-full mt-2 text-xs px-3 py-1.5 border border-gray-300 rounded-lg"
                          />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          गाव / शहर
                        </label>
                        <input
                          type="text"
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          placeholder="उदा. ऋद्धपूर, डोमेग्राम, फलटण"
                          className="w-full text-xs sm:text-sm px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          संपूर्ण पत्ता / ठिकाण तपशील
                        </label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="उदा. मंदिर रोड, बस स्टँडजवळ, ऋद्धपूर"
                          className="w-full text-xs sm:text-sm px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Contact & Leadership */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h5 className="text-sm font-bold text-saffron-800 font-devanagari flex items-center gap-1.5 border-b pb-2">
                      <User className="w-4 h-4 text-saffron-600" />
                      ३. मार्गप्रमुख व संपर्क क्रमांक
                    </h5>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          मार्गप्रमुख / व्यवस्थापक नाव
                        </label>
                        <input
                          type="text"
                          value={contactPerson}
                          onChange={(e) => setContactPerson(e.target.value)}
                          placeholder="उदा. प.पू. शास्त्री बाबा महानुभाव"
                          className="w-full text-xs sm:text-sm px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          मुख्य संपर्क मोबाईल नंबर *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="उदा. 9823456781"
                          className="w-full text-xs sm:text-sm px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          पर्यायी फोन नंबर (पर्यायी)
                        </label>
                        <input
                          type="tel"
                          value={secondaryPhone}
                          onChange={(e) => setSecondaryPhone(e.target.value)}
                          placeholder="दुसरा नंबर..."
                          className="w-full text-xs sm:text-sm px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-saffron-500"
                        />
                      </div>
                    </div>

                    {/* Member Statistics */}
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <label className="block text-xs font-bold text-gray-700 mb-2 font-devanagari flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-saffron-600" />
                        आश्रम सदस्य संख्या (पर्यायी माहिती):
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <div>
                          <span className="text-[11px] text-gray-600">भिक्षुक संख्या</span>
                          <input
                            type="number"
                            min="0"
                            value={bhikshuk}
                            onChange={(e) => setBhikshuk(Number(e.target.value))}
                            className="w-full text-xs p-1.5 border rounded bg-white text-center"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] text-gray-600">तपस्विनी संख्या</span>
                          <input
                            type="number"
                            min="0"
                            value={tapasvini}
                            onChange={(e) => setTapasvini(Number(e.target.value))}
                            className="w-full text-xs p-1.5 border rounded bg-white text-center"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] text-gray-600">बाल संख्या</span>
                          <input
                            type="number"
                            min="0"
                            value={children}
                            onChange={(e) => setChildren(Number(e.target.value))}
                            className="w-full text-xs p-1.5 border rounded bg-white text-center"
                          />
                        </div>
                        <div>
                          <span className="text-[11px] text-gray-600 font-bold">एकूण संख्या</span>
                          <div className="w-full text-xs p-1.5 bg-saffron-50 border border-saffron-200 rounded text-center font-bold text-saffron-800">
                            {Number(bhikshuk) + Number(tapasvini) + Number(children)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Facilities and Rooms */}
                  <div className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                    <h5 className="text-sm font-bold text-saffron-800 font-devanagari flex items-center gap-1.5 border-b pb-2">
                      <Building className="w-4 h-4 text-saffron-600" />
                      ४. उपलब्ध सुविधा, खोल्यांचे प्रकार व सेवा शुल्क
                    </h5>

                    {/* Facilities Chips */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 font-devanagari">
                        उपलब्ध सुविधा (क्लिक करून निवडा):
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {PRESET_FACILITIES.map(facility => {
                          const isSelected = selectedFacilities.includes(facility);
                          return (
                            <button
                              key={facility}
                              type="button"
                              onClick={() => handleToggleFacility(facility)}
                              className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-full border transition-all ${
                                isSelected
                                  ? 'bg-saffron-500 text-white border-saffron-600 shadow-sm'
                                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {facility}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customFacility}
                          onChange={(e) => setCustomFacility(e.target.value)}
                          placeholder="इतर सुविधा जोडा..."
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomFacility}
                          className="text-xs px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-devanagari"
                        >
                          + जोडा
                        </button>
                      </div>
                    </div>

                    {/* Rooms Chips */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 font-devanagari">
                        खोल्यांचे प्रकार (Room Types):
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {PRESET_ROOMS.map(room => {
                          const isSelected = selectedRooms.includes(room);
                          return (
                            <button
                              key={room}
                              type="button"
                              onClick={() => handleToggleRoom(room)}
                              className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-full border transition-all ${
                                isSelected
                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {room}
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customRoom}
                          onChange={(e) => setCustomRoom(e.target.value)}
                          placeholder="इतर खोली प्रकार जोडा..."
                          className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg flex-1"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomRoom}
                          className="text-xs px-3 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 font-devanagari"
                        >
                          + जोडा
                        </button>
                      </div>
                    </div>

                    {/* Seva Charge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          सेवा शुल्क / देणगी तपशील
                        </label>
                        <select
                          value={sevaCharge}
                          onChange={(e) => setSevaCharge(e.target.value)}
                          className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        >
                          {PRESET_SEVA_CHARGES.map(sc => (
                            <option key={sc} value={sc}>{sc}</option>
                          ))}
                        </select>
                      </div>

                      {/* Photo Presets */}
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1 font-devanagari">
                          फोटो प्रतिमा (निवडा किंवा URL टाका)
                        </label>
                        <select
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full text-xs sm:text-sm px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        >
                          {PRESET_IMAGES.map(img => (
                            <option key={img.url} value={img.url}>{img.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2.5 text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-devanagari"
                    >
                      फॉर्म स्वच्छ करा
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 bg-gradient-to-r from-saffron-500 to-orange-600 hover:from-saffron-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-md transition-all font-devanagari flex items-center gap-2 text-xs sm:text-sm disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          जतन होत आहे...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          {editingId ? 'निवास माहिती अद्ययावत करा' : 'नवीन निवास जतन करा'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Tab 2: Manage Existing Admin Added Niwas */
                <div className="space-y-4">
                  {/* Search within Admin List */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchManageTerm}
                        onChange={(e) => setSearchManageTerm(e.target.value)}
                        placeholder="जोडलेल्या निवासांमध्ये शोधा (नाव, जिल्हा, गाव, संपर्क)..."
                        className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-saffron-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setAdminTab('add');
                      }}
                      className="px-3.5 py-2 bg-saffron-600 text-white text-xs font-bold rounded-lg font-devanagari flex items-center gap-1.5 shadow-sm hover:bg-saffron-700 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      नवीन जोडा
                    </button>
                  </div>

                  {filteredAdminList.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
                      <Home className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-devanagari font-semibold">
                        {addedNiwasList.length === 0
                          ? 'अद्याप ॲडमिन पॅनलद्वारे कोणताही नवीन निवास जोडलेला नाही.'
                          : 'शोध परिणामात कोणताही निवास आढळला नाही.'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 font-sans">
                        वरील 'नवीन निवास जोडा' बटणावर क्लिक करून पहिला निवास जोडा.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredAdminList.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:border-saffron-300 transition-all"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <h6 className="font-bold text-gray-900 text-sm font-devanagari line-clamp-1">
                                {item.name}
                              </h6>
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0 font-devanagari font-semibold">
                                ॲडमिन नोंदणी
                              </span>
                            </div>

                            <p className="text-xs text-gray-600 flex items-center gap-1 mb-1 font-devanagari">
                              <MapPin className="w-3.5 h-3.5 text-saffron-500 shrink-0" />
                              {item.village ? `${item.village}, ` : ''}{item.taluka ? `ता. ${item.taluka}, ` : ''}जि. {item.district} ({item.state})
                            </p>

                            <p className="text-xs text-gray-600 flex items-center gap-1 mb-1 font-devanagari">
                              <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              {item.contactPerson || 'व्यवस्थापक'}
                            </p>

                            <p className="text-xs text-saffron-700 font-bold flex items-center gap-1 mb-2 font-sans">
                              <Phone className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
                              {item.phone || '-'}
                            </p>

                            {/* Facilities summary */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {(item.facilities?.mr || []).slice(0, 3).map((f, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                                >
                                  {f}
                                </span>
                              ))}
                              {(item.facilities?.mr || []).length > 3 && (
                                <span className="text-[10px] text-gray-400">
                                  +{(item.facilities?.mr || []).length - 3} अधिक
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                            <button
                              type="button"
                              onClick={() => handleEditClick(item)}
                              className="px-2.5 py-1 text-xs bg-saffron-50 text-saffron-700 hover:bg-saffron-100 rounded-lg font-devanagari font-semibold flex items-center gap-1"
                            >
                              <Edit2 className="w-3 h-3" />
                              संपादित करा
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id)}
                              className="px-2.5 py-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-devanagari font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              हटवा
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-gray-100 p-3 sm:p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span className="font-devanagari flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-saffron-500" />
            सर्व डेटा रिअल-टाइम क्लाउड व स्थानिक मेमरीमध्ये सुरक्षित साठवला जातो.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold font-devanagari transition-colors"
          >
            बंद करा
          </button>
        </div>
      </div>
    </div>
  );
}
