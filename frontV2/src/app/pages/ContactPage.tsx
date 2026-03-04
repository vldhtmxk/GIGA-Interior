import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Phone, Mail, Clock, CheckCircle } from "lucide-react";

const serviceTypes = ["주거 인테리어", "상업 인테리어", "오피스 인테리어", "호텔·숙박", "기타"];
const budgets = ["3,000만원 미만", "3,000~5,000만원", "5,000만원~1억원", "1억원 이상", "협의 가능"];

export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    budget: "",
    area: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-[#0a0a0a] pt-24">
      {/* Header */}
      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto py-20">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#c9a96e] text-[10px] tracking-[0.4em] uppercase mb-4"
        >
          Contact
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
          className="text-[clamp(3rem,7vw,7rem)] font-light text-white leading-none mb-8"
        >
          Let's create
          <br />
          <em className="text-[#c9a96e] not-italic">together</em>
        </motion.h1>
      </section>

      <section className="px-6 lg:px-16 max-w-[1400px] mx-auto pb-24 grid grid-cols-1 lg:grid-cols-5 gap-16">
        {/* Info Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-2 space-y-12"
        >
          <div>
            <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-6">Contact Info</p>
            <ul className="space-y-6">
              {[
                { icon: MapPin, label: "Address", value: "서울특별시 강남구 테헤란로 123\nGIGA Tower 15F" },
                { icon: Phone, label: "Phone", value: "02-1234-5678" },
                { icon: Mail, label: "Email", value: "hello@giga-interior.kr" },
                { icon: Clock, label: "Hours", value: "평일 09:00 – 18:00\n토요일 10:00 – 15:00 (예약 필수)" },
              ].map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-4">
                  <div className="w-8 h-8 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={13} className="text-[#c9a96e]" />
                  </div>
                  <div>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">{label}</p>
                    <p className="text-white/60 text-sm whitespace-pre-line">{value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[#c9a96e] text-[10px] tracking-[0.35em] uppercase mb-6">Process</p>
            <div className="space-y-4">
              {[
                { step: "01", text: "상담 신청 및 초기 미팅" },
                { step: "02", text: "현장 방문 및 니즈 파악" },
                { step: "03", text: "컨셉 디자인 제안" },
                { step: "04", text: "실시도면 및 시공" },
                { step: "05", text: "준공 및 사후 관리" },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-4 group">
                  <span className="text-[#c9a96e]/40 text-xs w-6">{step}</span>
                  <div className="h-px flex-1 bg-white/5 group-hover:bg-[#c9a96e]/20 transition-colors" />
                  <p className="text-white/40 text-sm group-hover:text-white/60 transition-colors">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-3"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-full flex flex-col items-center justify-center py-20 text-center border border-white/10"
            >
              <CheckCircle size={48} className="text-[#c9a96e] mb-6" />
              <h2
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-3xl text-white font-light mb-4"
              >
                상담 신청이 완료되었습니다
              </h2>
              <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                빠른 시일 내에 담당자가 연락을 드릴 예정입니다. 일반적으로 영업일 기준 1~2일 내에 연락드립니다.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2">
                    성함 <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors placeholder:text-white/20"
                    placeholder="홍길동"
                  />
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2">
                    연락처 <span className="text-[#c9a96e]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors placeholder:text-white/20"
                    placeholder="010-0000-0000"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2">이메일</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors placeholder:text-white/20"
                  placeholder="email@example.com"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2">
                    서비스 유형 <span className="text-[#c9a96e]">*</span>
                  </label>
                  <select
                    name="serviceType"
                    value={form.serviceType}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0a0a0a]">선택하세요</option>
                    {serviceTypes.map(s => <option key={s} value={s} className="bg-[#0a0a0a]">{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2">예산 범위</label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className="w-full bg-[#0a0a0a] border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#0a0a0a]">선택하세요</option>
                    {budgets.map(b => <option key={b} value={b} className="bg-[#0a0a0a]">{b}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2">공간 면적</label>
                <input
                  type="text"
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors placeholder:text-white/20"
                  placeholder="예) 아파트 84㎡, 상가 150㎡"
                />
              </div>

              <div>
                <label className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2">문의 내용</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-transparent border border-white/10 px-4 py-3 text-white text-sm focus:outline-none focus:border-[#c9a96e]/50 transition-colors resize-none placeholder:text-white/20"
                  placeholder="원하시는 스타일, 참고 이미지 URL, 기타 요청 사항 등을 자유롭게 작성해 주세요."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#c9a96e] text-[#0a0a0a] py-4 text-[11px] tracking-[0.3em] uppercase hover:bg-white transition-colors duration-300 font-medium"
              >
                무료 상담 신청하기
              </button>

              <p className="text-white/20 text-xs text-center">
                제출 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.
              </p>
            </form>
          )}
        </motion.div>
      </section>

      {/* Map placeholder */}
      <div className="h-64 bg-[#111] border-t border-white/5 flex items-center justify-center">
        <div className="text-center">
          <MapPin size={24} className="text-[#c9a96e] mx-auto mb-3" />
          <p className="text-white/30 text-xs tracking-widest">서울특별시 강남구 테헤란로 123</p>
        </div>
      </div>
    </div>
  );
}
