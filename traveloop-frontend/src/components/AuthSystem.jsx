import React, { useState } from 'react';
import { Eye, EyeOff, MapPin, Mail, Lock, User, Phone, ChevronDown, ArrowLeft, ShieldCheck } from 'lucide-react';

const AuthSystem = ({ onLogin }) => {
  // Modes: 'LOGIN', 'SIGNUP', 'FORGOT', 'VERIFY'
  const [mode, setMode] = useState('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', 
    countryCode: '+91', phone: '', password: '', confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    const noSpaceRegex = /^[^\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (mode === 'SIGNUP') {
      if (!formData.firstName || !noSpaceRegex.test(formData.firstName) || formData.firstName.length > 20) 
        newErrors.firstName = "Max 20 chars, no spaces.";
      if (!formData.lastName || !noSpaceRegex.test(formData.lastName) || formData.lastName.length > 20) 
        newErrors.lastName = "Max 20 chars, no spaces.";
      if (formData.phone.length !== 10) newErrors.phone = "Exactly 10 digits required.";
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords match error.";
      if (!passwordRegex.test(formData.password)) newErrors.password = "8+ chars, mix of alpha/num/special.";
      if (!emailRegex.test(formData.email)) newErrors.email = "Invalid domain or @ missing.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (validate()) {
      // In production, this triggers the backend to send an OTP to formData.email
      setMode('VERIFY');
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling) element.nextSibling.focus();
  };

  const verifyAccount = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '123456') { // Mock OTP verification
      onLogin({ name: `${formData.firstName} ${formData.lastName}`, is_admin: false });
    } else {
      alert("Invalid OTP. Try 123456 for testing.");
    }
  };

  const inputStyle = "w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all placeholder:text-slate-400 font-medium";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000')] bg-cover">
      <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[3px]"></div>
      
      <div className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/50 transition-all duration-500">
        
        {mode === 'VERIFY' ? (
          <div className="text-center animate-in fade-in zoom-in duration-500">
            <div className="inline-block p-4 bg-green-100 rounded-full text-green-600 mb-6">
              <ShieldCheck size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Verify Your Email</h2>
            <p className="text-slate-500 font-medium mb-8">
              We've sent a 6-digit code to <span className="text-blue-600 font-bold">{formData.email}</span>
            </p>

            <div className="flex justify-between gap-2 mb-8">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-12 h-14 text-center text-2xl font-black bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  value={data}
                  onChange={e => handleOtpChange(e.target, index)}
                  onFocus={e => e.target.select()}
                />
              ))}
            </div>

            <button 
              onClick={verifyAccount}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 mb-4"
            >
              Verify & Explore
            </button>
            <button 
              onClick={() => setMode('SIGNUP')}
              className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16}/> Back to Signup
            </button>
          </div>
        ) : (
          /* Render LOGIN/SIGNUP forms as before... */
          <form className="space-y-4" onSubmit={mode === 'SIGNUP' ? handleSignup : (e) => e.preventDefault()}>
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-blue-600 rounded-2xl shadow-lg mb-4 text-white"><MapPin size={28}/></div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Traveloop</h1>
              <p className="text-slate-500 font-medium">{mode === 'LOGIN' ? "Welcome back" : "Create Account"}</p>
            </div>

            {mode === 'SIGNUP' && (
              <div className="flex gap-3">
                <input type="text" placeholder="First Name" className={inputStyle.replace('pl-10', 'pl-4')} onChange={(e) => setFormData({...formData, firstName: e.target.value})}/>
                <input type="text" placeholder="Last Name" className={inputStyle.replace('pl-10', 'pl-4')} onChange={(e) => setFormData({...formData, lastName: e.target.value})}/>
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input type="email" placeholder="Email Address" className={inputStyle} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
            </div>

            {mode === 'SIGNUP' && (
              <div className="flex gap-2">
                <select className="bg-white/50 border border-slate-200 rounded-2xl px-2 text-sm font-bold">
                  <option>🇮🇳 +91</option>
                </select>
                <input type="number" placeholder="10 Digit Phone" className="flex-1 p-3 bg-white/60 border border-slate-200 rounded-2xl outline-none" onChange={(e) => setFormData({...formData, phone: e.target.value})}/>
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input type={showPassword ? "text" : "password"} placeholder="Password" className={inputStyle} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
            </div>

            <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-1">
              {mode === 'LOGIN' ? "Sign In" : "Register Now"}
            </button>
            
            <button type="button" onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')} className="w-full text-center text-sm font-bold text-blue-600 mt-4">
              {mode === 'LOGIN' ? "Need an account? Signup" : "Already registered? Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;