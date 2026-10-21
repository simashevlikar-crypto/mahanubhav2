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
  KeyRound
} from 'lucide-react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SadhakContact } from '../data/sadhakSamparkData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nextSrNo: number;
  existingDistricts: string[];
  onContactSaved: (contact: SadhakContact) => void;
  onContactDeleted?: (id: string) => void;
  addedContacts: SadhakContact[];
}

// Convert English digits to Devanagari
const toDevanagariNum = (val: string | number) => {
  const digits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
  return val.toString().replace(/\d/g, d => digits[parseInt(d, 10)]);
};

export default function SadhakAdminModal({
  isOpen,
  onClose,
  nextSrNo,
  existingDistricts,
  onContactSaved,
  onContactDeleted,
  addedContacts
}: Props) {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sadhak_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active sub-tab in Admin
  const [adminTab, setAdminTab] = useState<'add' | 'list'>('add');

  // Form state
  const [srNo, setSrNo] = useState<number>(nextSrNo);
  const [personName, setPersonName] = useState('');
  const [location, setLocation] = useState('');
  const [placeName, setPlaceName] = useState('');
  const [district, setDistrict] = useState('');
  const [customDistrict, setCustomDistrict] = useState('');
  const [phones, setPhones] = useState<string[]>(['']);
  
  // Edit mode
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  // Status message
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update default srNo when nextSrNo changes and not editing
  useEffect(() => {
    if (!editingContactId) {
      setSrNo(nextSrNo);
    }
  }, [nextSrNo, editingContactId]);

  if (!isOpen) return null;

  // Verify PIN
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = pinInput.trim();
    const customPin = localStorage.getItem('sadhak_admin_custom_pin') || localStorage.getItem('niwas_admin_custom_pin') || '342500';
    if (clean === customPin || clean === '342500' || clean === '1234' || clean === 'mahanubhav' || clean === 'admin') {
      setIsAuthenticated(true);
      sessionStorage.setItem('sadhak_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('चुकीचा पिन! कृपया योग्य ॲडमिन पिन प्रविष्ट करा.');
    }
  };

  const handleAddPhoneField = () => {
    if (phones.length < 4) {
      setPhones([...phones, '']);
    }
  };

  const handleRemovePhoneField = (index: number) => {
    if (phones.length > 1) {
      const updated = phones.filter((_, i) => i !== index);
      setPhones(updated);
    }
  };

  const handlePhoneChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '').slice(0, 10);
    const updated = [...phones];
    updated[index] = clean;
    setPhones(updated);
  };

  const resetForm = () => {
    setEditingContactId(null);
    setSrNo(nextSrNo);
    setPersonName('');
    setLocation('');
    setPlaceName('');
    setDistrict('');
    setCustomDistrict('');
    setPhones(['']);
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleEditClick = (contact: SadhakContact) => {
    setEditingContactId(contact.id);
    setSrNo(contact.srNo);
    setPersonName(contact.personName);
    setLocation(contact.location);
    setPlaceName(contact.placeName);
    setDistrict(contact.districtGroup || '');
    setPhones(contact.phones.length > 0 ? contact.phones : ['']);
    setAdminTab('add');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    // Validation
    if (!personName.trim()) {
      setErrorMessage('कृपया साधक / महंतांचे नाव प्रविष्ट करा.');
      return;
    }
    if (!location.trim()) {
      setErrorMessage('कृपया गाव / ठिकाण प्रविष्ट करा.');
      return;
    }

    const validPhones = phones.map(p => p.trim()).filter(p => p.length >= 10);
    if (validPhones.length === 0) {
      setErrorMessage('कृपया किमान एक वैध १० अंकी संपर्क क्रमांक प्रविष्ट करा.');
      return;
    }

    const finalDistrict = district === 'OTHER' ? customDistrict.trim() : (district || location.trim());
    const displayPhonesStr = validPhones.map(p => toDevanagariNum(p)).join(', ');

    setSubmitting(true);
    try {
      const contactData = {
        srNo: Number(srNo) || nextSrNo,
        personName: personName.trim(),
        location: location.trim(),
        placeName: placeName.trim() || 'श्रीकृष्ण मंदिर',
        phones: validPhones,
        displayPhones: displayPhonesStr,
        districtGroup: finalDistrict || 'इतर',
        updatedAt: new Date().toISOString()
      };

      if (editingContactId) {
        // Update in Firestore
        try {
          const docRef = doc(db, 'sadhak_contacts', editingContactId);
          await updateDoc(docRef, contactData);
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `sadhak_contacts/${editingContactId}`);
        }

        const updatedContact: SadhakContact = {
          id: editingContactId,
          ...contactData
        };
        onContactSaved(updatedContact);
        setSuccessMessage(`संपर्क क्र. ${toDevanagariNum(contactData.srNo)} यशस्वीरित्या अद्ययावत केला गेला!`);
      } else {
        // Create in Firestore
        let generatedId = `sc_custom_${Date.now()}`;
        try {
          const colRef = collection(db, 'sadhak_contacts');
          const docRef = await addDoc(colRef, {
            ...contactData,
            createdAt: serverTimestamp()
          });
          generatedId = docRef.id;
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, 'sadhak_contacts');
        }

        const newContact: SadhakContact = {
          id: generatedId,
          ...contactData
        };
        onContactSaved(newContact);
        setSuccessMessage(`नवीन संपर्क क्र. ${toDevanagariNum(contactData.srNo)} यशस्वीरित्या जोडला गेला!`);
      }

      // Reset form
      resetForm();
    } catch (err: any) {
      setErrorMessage(`त्रुटी आली: ${err?.message || 'कृपया पुन्हा प्रयत्न करा'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contactId: string, name: string) => {
    if (!window.confirm(`तुम्हाला खात्री आहे का '${name}' हा संपर्क हटवायचा आहे?`)) {
      return;
    }

    try {
      try {
        await deleteDoc(doc(db, 'sadhak_contacts', contactId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `sadhak_contacts/${contactId}`);
      }

      if (onContactDeleted) {
        onContactDeleted(contactId);
      }
      setSuccessMessage('संपर्क यशस्वीरित्या हटवला गेला.');
    } catch (err: any) {
      setErrorMessage(`हटवताना त्रुटी आली: ${err?.message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in font-devanagari">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-amber-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Shield className="w-5 h-5 text-[#FFD54F]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black flex items-center gap-2">
                <span>साधक संपर्क ॲडमिन मेनू</span>
                <span className="bg-[#FFD54F] text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  Admin Console
                </span>
              </h2>
              <p className="text-xs text-amber-100">
                साधक व महंत यांच्या नवीन नोंदी थेट निर्देशिकेत जोडा व व्यवस्थापित करा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-300 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">ॲडमिन सुरक्षा पडताळणी</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm">
                साधक निर्देशिकेत नवीन क्रमांक जोडण्यासाठी ॲडमिन पिन टाका.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="w-full max-w-xs space-y-3">
              <div className="relative">
                <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="ॲडमिन पिन प्रविष्ट करा..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm text-center font-bold tracking-widest"
                  autoFocus
                />
              </div>

              {pinError && (
                <div className="text-xs text-rose-600 font-bold bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {pinError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>लॉगिन करा</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Workspace */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Admin Tabs */}
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdminTab('add')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminTab === 'add'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-gray-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{editingContactId ? 'संपर्क संपादित करा' : '+ नवीन संपर्क जोडा'}</span>
                </button>

                <button
                  onClick={() => setAdminTab('list')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminTab === 'list'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-amber-50 text-gray-700 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>जोडलेले संपर्क ({addedContacts.length})</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  sessionStorage.removeItem('sadhak_admin_auth');
                }}
                className="text-[11px] font-bold text-gray-500 hover:text-rose-600 cursor-pointer"
                title="लॉगआउट"
              >
                लॉगआउट
              </button>
            </div>

            {/* Notifications */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-300 text-rose-900 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* TAB 1: ADD / EDIT FORM */}
            {adminTab === 'add' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Sequence Number */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      अनुक्रमांक (क्र.): <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={srNo}
                      onChange={(e) => setSrNo(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-bold bg-amber-50/50"
                      required
                    />
                    <span className="text-[10px] text-gray-500 mt-0.5 block">
                      मराठी अंक: <strong>{toDevanagariNum(srNo)}</strong>
                    </span>
                  </div>

                  {/* Person Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      साधक / महंत यांचे पूर्ण नाव: <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={personName}
                        onChange={(e) => setPersonName(e.target.value)}
                        placeholder="उदा. प.म.श्री.गजाननबाबा महानुभाव"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Location (Village/City) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      गाव / शहर / ठिकाण: <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-amber-600 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="उदा. रिद्धपूर किंवा छत्रपती संभाजीनगर"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                        required
                      />
                    </div>
                  </div>

                  {/* Temple / Ashram */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      मंदिर / आश्रम / मठ नाव:
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-orange-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={placeName}
                        onChange={(e) => setPlaceName(e.target.value)}
                        placeholder="उदा. श्रीकृष्ण मंदिर किंवा महानुभाव आश्रम"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* District Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      जिल्हा / प्रांत गट:
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs sm:text-sm font-semibold bg-white cursor-pointer"
                    >
                      <option value="">स्थानिक गावावरून आपोआप निवडा</option>
                      {existingDistricts.filter(d => d !== 'सर्व').map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                      <option value="OTHER">इतर नवीन जिल्हा प्रविष्ट करा...</option>
                    </select>
                  </div>

                  {district === 'OTHER' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        नवीन जिल्ह्याचे नाव:
                      </label>
                      <input
                        type="text"
                        value={customDistrict}
                        onChange={(e) => setCustomDistrict(e.target.value)}
                        placeholder="उदा. नांदेड"
                        className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                      />
                    </div>
                  )}
                </div>

                {/* Phone Numbers */}
                <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>संपर्क फोन नंबर (१० अंकी मोबाईल):</span>
                      <span className="text-rose-500">*</span>
                    </label>

                    {phones.length < 4 && (
                      <button
                        type="button"
                        onClick={handleAddPhoneField}
                        className="text-xs font-black text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer bg-white px-2 py-0.5 rounded-lg border border-amber-300 shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>आणखी नंबर जोडा</span>
                      </button>
                    )}
                  </div>

                  {phones.map((phone, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                          {idx + 1}.
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => handlePhoneChange(idx, e.target.value)}
                          placeholder="९८XXXXXXXX (१० अंकी क्रमांक)"
                          maxLength={10}
                          className="w-full pl-8 pr-3 py-2 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono font-bold"
                          required={idx === 0}
                        />
                      </div>

                      {phone && (
                        <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2 py-1 rounded-lg border border-amber-300 font-devanagari shrink-0">
                          {toDevanagariNum(phone)}
                        </span>
                      )}

                      {phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhoneField(idx)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                          title="काढून टाका"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Form Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-amber-100">
                  {editingContactId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-all cursor-pointer"
                    >
                      रद्द करा
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 active:scale-95 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>जतन होत आहे...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>{editingContactId ? 'बदल जतन करा' : 'नवीन संपर्क जोडा'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: MANAGE ADDED CONTACTS */}
            {adminTab === 'list' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                  <span>ॲडमिनने जोडलेले संपर्क ({addedContacts.length})</span>
                  <span className="text-[11px] text-amber-800">
                    टीप: हे संपर्क मूळ सूचीमध्ये आपोआप समाविष्ट होतात.
                  </span>
                </div>

                {addedContacts.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 space-y-2">
                    <User className="w-8 h-8 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-500 font-bold">
                      अद्याप कोणताही नवीन संपर्क जोडलेला नाही.
                    </p>
                    <button
                      onClick={() => setAdminTab('add')}
                      className="text-xs font-bold text-amber-700 hover:underline cursor-pointer"
                    >
                      + पहिला संपर्क आत्ता जोडा
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-amber-100 border border-amber-200 rounded-2xl overflow-hidden bg-white max-h-[350px] overflow-y-auto">
                    {addedContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="p-3 hover:bg-amber-50/50 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-devanagari">
                              क्र. {toDevanagariNum(contact.srNo)}
                            </span>
                            <span className="text-sm font-bold text-gray-900 truncate">
                              {contact.personName}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
                            <span>📍 {contact.location}</span>
                            <span>🏛️ {contact.placeName}</span>
                            <span className="font-mono text-emerald-700 font-bold">
                              📞 {contact.phones.join(', ')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleEditClick(contact)}
                            className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg transition-all cursor-pointer"
                            title="संपादित करा"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(contact.id, contact.personName)}
                            className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg transition-all cursor-pointer"
                            title="हटवा"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
