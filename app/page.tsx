"use client"
import { useState, useRef, useEffect } from 'react'
import { mockSendCodeApi, mockLoginApi } from './service'
import './home.css'

// 手机号正则验证（中国手机号）
const PHONE_REGEX = /^1[3-9]\d{9}$/;
// 验证码正则（6位数字）
const CODE_REGEX = /^\d{6}$/;

export default function Home() {
  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [errors, setErrors] = useState({
    phone: '',
    code: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  // 定时器引用
  const timerRef = useRef<NodeJS.Timeout>(null);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 处理手机号验证
  const validatePhone = (value: string) => {
    if (!value) return '请输入手机号';
    if (!PHONE_REGEX.test(value)) return '手机号格式错误';
    return '';
  };

  // 处理验证码验证
  const validateCode = (value: string) => {
    if (!value) return '请输入验证码';
    if (!CODE_REGEX.test(value)) return '验证码格式错误';
    return '';
  };

  // 发送验证码
  const handleSendCode = async(e: any) => {
    e.preventDefault();
    const error = validatePhone(phone);
    if (error) {
      setErrors(prev => ({ ...prev, phone: error }));
      return;
    }

    try {
      // 模拟API请求
      setIsSending(true);
      await mockSendCodeApi(phone);
      
      // 开始倒计时
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      alert('发送验证码失败');
    } finally {
      setIsSending(false);
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    const phoneError = validatePhone(phone);
    const codeError = validateCode(code);
    
    if (phoneError || codeError) {
      setErrors({ phone: phoneError, code: codeError });
      console.log(phoneError);
      
      return;
    }

    try {
      setIsLoading(true);
      // 模拟登录请求
      await mockLoginApi(phone, code);
      alert('登录成功');
    } catch (err) {
      alert('登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form>
      <div className="form-item">
        <input
          type='tel'
          placeholder="手机号"
          name="mobile"
          className={errors.phone ? 'input-error' : ''}
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setErrors(prev => ({ ...prev, phone: '' }));
          }}
         />
        {errors.phone && <p className="form-error">{errors.phone}</p>}
        {/* 表单错误提示，会出现两种情况
        1.必填校验，错误提示“请输入手机号”
        2.格式校验，需满足国内手机号规则，错误提示“手机号格式错误”
        举例：<p className="form-error">手机号格式错误</p> */}
      </div>

      <div className="form-item">
        <div className="input-group">
          <input
            placeholder="验证码"
            name="code" 
            className={errors.code ? 'input-error' : ''}
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setErrors(prev => ({ ...prev, code: '' }));
            }}
            maxLength={6}
          />
          {/* getcode默认disabled=true，当mobile满足表单验证条件后才位false */}
          <button
            className="getcode"
            disabled={countdown > 0 || isSending || isLoading}
            onClick={handleSendCode}
          >
            {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
          </button>
        </div>
        {errors.code && <p className="form-error">{errors.code}</p>}
        {/* 表单错误提示，会出现两种情况
        
        1.必填校验，错误提示“请输入验证码”
        2.格式校验，6位数字，错误提示“验证码格式错误”
        举例：<p className="form-error">验证码格式错误</p> */}
      </div>

      {/* 表单提交中，按钮内的文字会变成“submiting......” */}
      <button className="submit-btn" disabled={isLoading || isSending} onClick={handleSubmit}>{isLoading ? 'submiting......': '登录'}</button>
    </form>
  );
}
