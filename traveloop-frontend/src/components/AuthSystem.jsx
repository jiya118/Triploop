import { useState } from 'react';
import { Eye, EyeOff, MapPin, Mail, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '../api';

const AuthSystem = ({ onLogin }) => {
  const resetTokenFromUrl = new URLSearchParams(window.location.search).get('token');
  const isResetRoute = window.location.pathname === '/reset-password';
  const [mode, setMode] = useState(isResetRoute && resetTokenFromUrl ? 'RESET' : 'LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    countryCode: '+91',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRules = [
    { label: 'At least 8 characters', valid: formData.password.length >= 8 },
    { label: 'Includes an alphabet', valid: /[A-Za-z]/.test(formData.password) },
    { label: 'Includes a number', valid: /\d/.test(formData.password) },
    { label: 'Includes a special character', valid: /[@$!%*#?&]/.test(formData.password) },
  ];

  const resetAlerts = () => {
    setErrors({});
    setMessage('');
  };

  const validate = () => {
    const newErrors = {};
    const noSpaceRegex = /^[^\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email address.';

    if (mode === 'SIGNUP') {
      if (!formData.firstName || !noSpaceRegex.test(formData.firstName) || formData.firstName.length > 20) {
        newErrors.firstName = 'Max 20 chars, no spaces.';
      }
      if (!formData.lastName || !noSpaceRegex.test(formData.lastName) || formData.lastName.length > 20) {
        newErrors.lastName = 'Max 20 chars, no spaces.';
      }
      if (formData.phone.length !== 10) newErrors.phone = 'Exactly 10 digits required.';
      if (!passwordRegex.test(formData.password)) newErrors.password = '8+ chars, alpha/num/special required.';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match.';
    }

    if (mode === 'RESET') {
      delete newErrors.email;
      if (!passwordRegex.test(formData.password)) newErrors.password = '8+ chars, alpha/num/special required.';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    resetAlerts();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post('/auth/signup/initiate', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        countryCode: formData.countryCode,
        phone: formData.phone,
        password: formData.password
      });
      setMode('VERIFY');
      setMessage('OTP sent to your email. Enter it below to verify.');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (Number.isNaN(Number(element.value))) return;
    setOtp(otp.map((d, idx) => (idx === index ? element.value : d)));
    if (element.value && element.nextSibling) element.nextSibling.focus();
  };

  const verifyAccount = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setMessage('Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/signup/verify', { email: formData.email, code });
      onLogin({ name: `${formData.firstName} ${formData.lastName}`, is_admin: false });
    } catch (err) {
      setMessage(err.response?.data?.detail || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetAlerts();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });
      onLogin(response.data);
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    resetAlerts();
    if (!formData.email) {
      setMessage('Enter your email to receive a reset link.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email: formData.email });
      setMessage(response.data?.message || 'Reset link sent to your email!');
      setMode('LOGIN');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    resetAlerts();
    if (!resetTokenFromUrl) {
      setMessage('This reset link is missing a token.');
      return;
    }
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await api.post('/auth/reset-password', {
        token: resetTokenFromUrl,
        password: formData.password
      });
      window.history.replaceState({}, '', '/');
      setFormData({ ...formData, password: '', confirmPassword: '' });
      setMode('LOGIN');
      setMessage(response.data?.message || 'Password reset successful. Please login.');
    } catch (err) {
      setMessage(err.response?.data?.detail || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = 'w-full pl-10 pr-4 py-3 bg-white/60 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none transition-all placeholder:text-slate-400 font-medium';

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
                  inputMode="numeric"
                  maxLength="1"
                  className="w-12 h-14 text-center text-2xl font-black bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                  value={data}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>

            {message && <p className="mb-4 text-sm font-bold text-slate-500">{message}</p>}

            <button
              onClick={verifyAccount}
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 mb-4 disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify & Explore'}
            </button>
            <button
              onClick={() => setMode('SIGNUP')}
              className="text-sm font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16}/> Back to Signup
            </button>
          </div>
        ) : mode === 'RESET' ? (
          <form className="space-y-4 animate-in fade-in zoom-in duration-300" onSubmit={handleResetPassword}>
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-blue-600 rounded-2xl shadow-lg mb-4 text-white"><Lock size={28}/></div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Reset Password</h1>
              <p className="text-slate-500 font-medium">Create a new secure password.</p>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input type={showPassword ? 'text' : 'password'} placeholder="New Password" className={`${inputStyle} pr-12`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            {errors.password && <p className="-mt-2 text-[11px] font-bold text-red-500">{errors.password}</p>}

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password must contain</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {passwordRules.map((rule) => (
                  <p key={rule.label} className={`text-xs font-bold ${rule.valid ? 'text-green-600' : 'text-slate-400'}`}>
                    {rule.valid ? 'OK' : '-'} {rule.label}
                  </p>
                ))}
              </div>
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Confirm New Password" className={inputStyle} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}/>
              {errors.confirmPassword && <p className="mt-1 text-[11px] font-bold text-red-500">{errors.confirmPassword}</p>}
            </div>

            {message && <p className="text-center text-sm font-bold text-red-500">{message}</p>}
            <button disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl disabled:opacity-60">
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            <button type="button" onClick={() => { window.history.replaceState({}, '', '/'); setMode('LOGIN'); }} className="w-full text-sm font-bold text-slate-400">
              Back to Login
            </button>
          </form>
        ) : mode === 'FORGOT' ? (
          <form className="space-y-4 animate-in fade-in zoom-in duration-300" onSubmit={handleForgotPassword}>
            <p className="text-sm text-slate-500 text-center">Enter your email to receive a reset link.</p>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="Email Address"
                className={inputStyle}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            {message && <p className="text-center text-sm font-bold text-red-500">{message}</p>}
            <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl disabled:opacity-60">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <button type="button" onClick={() => setMode('LOGIN')} className="w-full text-sm font-bold text-slate-400">
              Back to Login
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={mode === 'LOGIN' ? handleLogin : handleSignup}>
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-blue-600 rounded-2xl shadow-lg mb-4 text-white"><MapPin size={28}/></div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Traveloop</h1>
              <p className="text-slate-500 font-medium">{mode === 'LOGIN' ? 'Welcome back' : 'Create Account'}</p>
            </div>

            {mode === 'SIGNUP' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input type="text" placeholder="First Name" className={inputStyle.replace('pl-10', 'pl-4')} value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}/>
                  {errors.firstName && <p className="mt-1 text-[11px] font-bold text-red-500">{errors.firstName}</p>}
                </div>
                <div>
                  <input type="text" placeholder="Last Name" className={inputStyle.replace('pl-10', 'pl-4')} value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}/>
                  {errors.lastName && <p className="mt-1 text-[11px] font-bold text-red-500">{errors.lastName}</p>}
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input type="email" placeholder="Email Address" className={inputStyle} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
            </div>
            {errors.email && <p className="-mt-2 text-[11px] font-bold text-red-500">{errors.email}</p>}

            {mode === 'SIGNUP' && (
              <div className="flex gap-2">
                <select className="bg-white/50 border border-slate-200 rounded-2xl px-2 text-sm font-bold" value={formData.countryCode} onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}>
                  <option value="+91">IN +91</option>
                  <option value="+1">US +1</option>
                  <option value="+44">UK +44</option>
                </select>
                <div className="flex-1">
                  <input type="tel" inputMode="numeric" maxLength="10" placeholder="10 Digit Phone" className="w-full p-3 bg-white/60 border border-slate-200 rounded-2xl outline-none" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}/>
                  {errors.phone && <p className="mt-1 text-[11px] font-bold text-red-500">{errors.phone}</p>}
                </div>
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <input type={showPassword ? 'text' : 'password'} placeholder="Password" className={`${inputStyle} pr-12`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            {errors.password && <p className="-mt-2 text-[11px] font-bold text-red-500">{errors.password}</p>}

            {mode === 'SIGNUP' && (
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Password must contain</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {passwordRules.map((rule) => (
                    <p key={rule.label} className={`text-xs font-bold ${rule.valid ? 'text-green-600' : 'text-slate-400'}`}>
                      {rule.valid ? 'OK' : '-'} {rule.label}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {mode === 'SIGNUP' && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Confirm Password" className={inputStyle} value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}/>
                {errors.confirmPassword && <p className="mt-1 text-[11px] font-bold text-red-500">{errors.confirmPassword}</p>}
              </div>
            )}

            {message && <p className="text-center text-sm font-bold text-red-500">{message}</p>}

            <button disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-60">
              {loading ? 'Please wait...' : mode === 'LOGIN' ? 'Sign In' : 'Register Now'}
            </button>

            {mode === 'LOGIN' && (
              <button
                type="button"
                onClick={() => setMode('FORGOT')}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors mt-2 text-right w-full"
              >
                Forgot Password?
              </button>
            )}

            <button type="button" onClick={() => { resetAlerts(); setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); }} className="w-full text-center text-sm font-bold text-blue-600 mt-4">
              {mode === 'LOGIN' ? 'Need an account? Signup' : 'Already registered? Login'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthSystem;
