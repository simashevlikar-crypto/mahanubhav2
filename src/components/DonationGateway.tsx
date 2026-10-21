/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Download, QrCode, CreditCard, ShieldCheck } from 'lucide-react';
import { translations } from '../translations';

interface DonationGatewayProps {
  lang?: 'hi' | 'mr' | 'en';
}

export default function DonationGateway({ lang = 'mr' }: DonationGatewayProps) {
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [amount, setAmount] = useState('500');
  const [purpose, setPurpose] = useState('temple_dev');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  const handleCustomAmount = (val: string) => {
    setAmount(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !amount) return;
    setReceiptNumber('MV-' + Math.floor(100000 + Math.random() * 900000));
    setIsSubmitted(true);
  };

  // Generate UPI payment URL
  const defaultUpi = "vikasp.5986@okaxis";
  const upiUrl = `upi://pay?pa=${defaultUpi}&pn=Mahanubhav%20Vishwa&am=${amount}&cu=INR&tn=Spiritual%20Contribution`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;

  return (
    <div id="donation-root" className="bg-white rounded-2xl shadow-md border border-saffron-100 overflow-hidden min-h-[500px]">
      {/* Header */}
      <div className="bg-saffron-50 p-6 border-b border-saffron-100 text-center">
        <h2 className="text-2xl font-bold text-saffron-700 font-devanagari inline-flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-saffron-500" />
          {translations.donationHeader[lang]}
        </h2>
        <p className="text-sm text-gray-600 mt-1 font-sans max-w-xl mx-auto">
          {translations.donationSub[lang]}
        </p>
      </div>

      {!isSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Form Block */}
          <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-saffron-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider border-b border-gray-100 pb-2 font-sans">
                {lang === 'mr' ? 'सहयोग तपशील भरा' : lang === 'hi' ? 'सहयोग विवरण अंकित करें' : 'Enter Contribution Details'}
              </h3>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-sans">
                  {lang === 'mr' ? 'सहयोग्याचे नाव (Full Name)' : lang === 'hi' ? 'सहयोगी का नाम (Full Name)' : 'Donor Name (Full Name)'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'mr' ? 'आपले नाव प्रविष्ट करा...' : lang === 'hi' ? 'अपना नाम अंकित करें...' : 'Enter your name...'}
                  className="w-full px-3.5 py-2 text-sm border border-saffron-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-sans">
                  {lang === 'mr' ? 'ईमेल (Email Address)' : lang === 'hi' ? 'ईमेल (Email Address)' : 'Email Address'}
                </label>
                <input
                  type="email"
                  placeholder={lang === 'mr' ? 'आपला ईमेल प्रविष्ट करा (पर्यायी)...' : lang === 'hi' ? 'अपना ईमेल दर्ज करें (वैकल्पिक)...' : 'Enter your email (optional)...'}
                  className="w-full px-3.5 py-2 text-sm border border-saffron-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                />
              </div>

              {/* Purpose */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 font-sans">
                  {lang === 'mr' ? 'सहयोगाचा उद्देश (Purpose)' : lang === 'hi' ? 'सहयोग का उद्देश्य (Purpose)' : 'Purpose of Contribution'}
                </label>
                <select
                  className="w-full px-3 py-2 text-sm border border-saffron-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                >
                  <option value="temple_dev">
                    {lang === 'mr' ? 'तीर्थक्षेत्र जीर्णोद्धार' : lang === 'hi' ? 'तीर्थक्षेत्र जीर्णोद्धार' : 'Temple Development'}
                  </option>
                  <option value="annadan">
                    {lang === 'mr' ? 'नित्य अन्नदान सेवा' : lang === 'hi' ? 'नित्य अन्नदान सेवा' : 'Daily Food Seva'}
                  </option>
                  <option value="granth_digital">
                    {lang === 'mr' ? 'ग्रंथ डिजिटल प्रकाशन' : lang === 'hi' ? 'ग्रंथ डिजिटल प्रकाशन' : 'Scripture Digitalization'}
                  </option>
                  <option value="general">
                    {lang === 'mr' ? 'सामान्य धर्मार्थ सेवा' : lang === 'hi' ? 'सामान्य धर्मार्थ सेवा' : 'General Donation'}
                  </option>
                </select>
              </div>

              {/* Amount Quick Picker */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 font-sans">
                  {lang === 'mr' ? 'सहयोग रक्कम (Amount INR)' : lang === 'hi' ? 'सहयोग राशि (Amount INR)' : 'Contribution Amount (INR)'}
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {['100', '500', '1100', '5100'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleCustomAmount(val)}
                      className={`py-2 rounded-lg text-xs font-bold transition-all border font-mono ${
                        amount === val
                          ? 'bg-saffron-500 text-white border-saffron-500 shadow-xs'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-saffron-300'
                      }`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-2 text-gray-400 text-sm font-bold font-mono">₹</span>
                  <input
                    type="number"
                    placeholder={lang === 'mr' ? 'इतर रक्कम प्रविष्ट करा...' : lang === 'hi' ? 'अन्य राशि भरें...' : 'Enter custom amount...'}
                    className="w-full pl-7 pr-3 py-1.5 text-sm border border-saffron-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron-500 bg-white font-mono"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 shadow-md border border-saffron-600"
              >
                {lang === 'mr' ? 'सहयोग पूर्ण करा' : lang === 'hi' ? 'सहयोग पूर्ण करें' : 'Proceed to Contribute'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* QR Code and Security Info Block */}
          <div className="p-6 md:p-8 bg-saffron-50/20 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 font-sans flex items-center gap-1.5 justify-center">
              <QrCode className="w-4 h-4 text-saffron-500" />
              {lang === 'mr' ? 'त्वरित देयक QR कोड' : lang === 'hi' ? 'त्वरित भुगतान QR कोड (Scan & Pay)' : 'Instant Payment QR Code'}
            </h3>

            {/* Dynamic QR Code */}
            <div className="bg-white p-4 rounded-2xl shadow-md border border-saffron-100 flex flex-col items-center justify-center max-w-[240px] w-full">
              <img
                src={qrCodeUrl}
                alt="Donation UPI QR Code"
                className="w-44 h-44 object-contain"
                referrerPolicy="no-referrer"
              />
              <span className="text-[9px] font-bold text-gray-400 mt-2 font-mono uppercase">
                UPI ID: {defaultUpi}
              </span>
            </div>

            <p className="text-[11px] text-gray-500 mt-4 max-w-xs font-sans leading-relaxed">
              {lang === 'mr'
                ? 'तुम्ही वरील QR कोड कोणत्याही पेमेंट ॲपद्वारे (Google Pay, PhonePe, Paytm, BHIM) स्कॅन करून रक्कम पाठवू शकता.'
                : lang === 'hi'
                ? 'आप ऊपर दिए गए QR कोड को किसी भी पेमेंट ऐप (Google Pay, PhonePe, Paytm, BHIM) से स्कैन करके सहयोग राशि भेज सकते हैं।'
                : 'You can scan the QR code above with any payment app (Google Pay, PhonePe, Paytm, BHIM) to make a contribution.'}
            </p>

            <div className="mt-8 p-3.5 bg-white border border-saffron-100 rounded-xl max-w-xs flex items-start gap-3 text-left">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-gray-700 font-sans">
                  {lang === 'mr' ? 'सुरक्षित आणि पारदर्शक' : lang === 'hi' ? 'सुरक्षित और पारदर्शी' : 'Secure & Transparent'}
                </h4>
                <p className="text-[9px] text-gray-400 mt-0.5 font-sans leading-relaxed">
                  {lang === 'mr'
                    ? 'तुमचे योगदान थेट अधिकृत सेवा खात्यात जमा केले जाते. नियमानुसार कर सवलत लागू आहे.'
                    : lang === 'hi'
                    ? 'आपका सहयोग सीधे पंथ के आधिकारिक चैरिटेबल खातों में जमा होता है। दान पर आयकर छूट नियमानुसार लागू है।'
                    : 'Your contribution goes directly to the official charitable bank accounts. Tax exemption benefits apply as per regulations.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* SUCCESS RECEIPT / CERTIFICATE */
        <div className="p-6 md:p-12 bg-saffron-50/10 flex flex-col items-center justify-center text-center">
          <div className="max-w-2xl w-full bg-white border border-saffron-200 rounded-3xl p-6 md:p-10 shadow-lg relative overflow-hidden">
            {/* Spiritual background mandala decoration style */}
            <div className="absolute top-0 right-0 p-8 text-saffron-100/30 font-display text-8xl select-none leading-none pointer-events-none">
              ॐ
            </div>

            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
            <span className="text-[11px] bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-sans">
              {lang === 'mr' ? 'दान स्वीकृत' : lang === 'hi' ? 'दान स्वीकृत' : 'Receipt Generated'}
            </span>

            <h3 className="text-2xl font-black text-saffron-700 font-devanagari mt-4">
              {lang === 'mr' ? '॥ धर्मार्थ दान पावती पत्र ॥' : lang === 'hi' ? '॥ धर्मार्थ दान पावती पत्र ॥' : '|| Charitable Donation Receipt ||'}
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1">
              {lang === 'mr' ? 'पावती क्र' : lang === 'hi' ? 'पावती क्र' : 'Receipt No'}: {receiptNumber}
            </p>

            {/* Certificate Border Details */}
            <div className="my-6 border-2 border-dashed border-saffron-100 p-5 rounded-2xl bg-saffron-50/30 text-left space-y-3 font-sans">
              <p className="text-sm text-gray-700 font-devanagari leading-relaxed">
                {lang === 'mr' ? (
                  <>
                    याद्वारे प्रमाणित करण्यात येते की परम श्रद्धालु <span className="font-bold text-gray-900 font-sans">{donorName}</span> यांनी महानुभाव विश्व संघटनेत धर्मार्थ कार्यासाठी <span className="font-bold text-saffron-600 font-sans">₹{amount}</span> ची सहयोग रक्कम सादर समर्पित केली आहे.
                  </>
                ) : lang === 'hi' ? (
                  <>
                    यह प्रमाणित किया जाता है कि परम श्रद्धालु <span className="font-bold text-gray-900 font-sans">{donorName}</span> ने महानुभाव विश्व संगठन में धर्मार्थ कार्यों हेतु <span className="font-bold text-saffron-600 font-sans">₹{amount}</span> की सहयोग राशि सादर समर्पित की है।
                  </>
                ) : (
                  <>
                    This is to certify that devout follower <span className="font-bold text-gray-900 font-sans">{donorName}</span> has contributed a generous sum of <span className="font-bold text-saffron-600 font-sans">₹{amount}</span> to the Mahanubhav Vishwa Organization for spiritual and welfare causes.
                  </>
                )}
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-saffron-100">
                <div>
                  <p className="font-bold text-gray-500">
                    {lang === 'mr' ? 'सहयोगाचा उद्देश:' : lang === 'hi' ? 'सहयोग का उद्देश्य:' : 'Sewa Cause:'}
                  </p>
                  <p className="text-gray-700 font-devanagari mt-0.5">
                    {purpose === 'temple_dev' && (lang === 'mr' ? 'तीर्थक्षेत्र जीर्णोद्धार' : lang === 'hi' ? 'तीर्थक्षेत्र जीर्णोद्धार' : 'Temple Development')}
                    {purpose === 'annadan' && (lang === 'mr' ? 'नित्य अन्नदान सेवा' : lang === 'hi' ? 'नित्य अन्नदान सेवा' : 'Daily Food Seva')}
                    {purpose === 'granth_digital' && (lang === 'mr' ? 'ग्रंथ डिजिटल प्रकाशन' : lang === 'hi' ? 'ग्रंथ डिजिटल प्रकाशन' : 'Scripture Digitalization')}
                    {purpose === 'general' && (lang === 'mr' ? 'सामान्य धर्मार्थ सेवा' : lang === 'hi' ? 'सामान्य धर्मार्थ सेवा' : 'General Donation')}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-gray-500">
                    {lang === 'mr' ? 'देयक तारीख:' : lang === 'hi' ? 'भुगतान तिथि:' : 'Payment Date:'}
                  </p>
                  <p className="text-gray-700 mt-0.5 font-mono">
                    {new Date().toLocaleDateString(lang === 'mr' ? 'mr-IN' : lang === 'hi' ? 'hi-IN' : 'en-US')}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 italic font-devanagari max-w-md mx-auto">
              {lang === 'mr'
                ? '"ईश्वर भक्ती आणि जनकल्याण मार्गावर टाकलेले हे पाऊल आपल्या जीवनात आनंद व समाधान मिळवून देवो."'
                : lang === 'hi'
                ? '"ईश्वर भक्ति और जनकल्याण की राह पर उठाया गया यह कदम आपके जीवन को परम संतोष से भर दे।"'
                : '"May this noble step taken on the path of devotion and humanity fill your life with eternal peace and contentment."'}
            </p>

            {/* Receipt buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all font-sans"
              >
                {lang === 'mr' ? 'नवीन योगदान करा' : lang === 'hi' ? 'नया योगदान करें' : 'Contribute Again'}
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-saffron-500 hover:bg-saffron-600 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm border border-saffron-600 font-sans"
              >
                <Download className="w-4 h-4" />
                {lang === 'mr' ? 'पावती डाऊनलोड करा (Print)' : lang === 'hi' ? 'प्रमाणपत्र प्रिंट करें' : 'Print Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
