"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Mail, Phone, MapPin, Download } from "lucide-react"
import { inquiryApi } from "@/lib/api"

const formSchema = z.object({
  name: z.string().min(2, { message: "이름을 입력해주세요" }),
  email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요" }),
  phone: z.string().min(10, { message: "유효한 전화번호를 입력해주세요" }),
  projectType: z.string().min(1, { message: "프로젝트 유형을 선택해주세요" }),
  budget: z.string().min(1, { message: "예산 범위를 선택해주세요" }),
  message: z.string().min(10, { message: "메시지를 10자 이상 입력해주세요" }),
})

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "",
      budget: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitError("")

    try {
      await inquiryApi.create({
        name: values.name,
        email: values.email,
        phone: values.phone,
        projectType: values.projectType,
        budgetRange: values.budget,
        message: values.message,
      })

      setIsSubmitted(true)
      form.reset()
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "문의 접수 중 오류가 발생했습니다.")
    }
  }

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/menu-hero/contact.svg"
          alt="Contact Us"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">문의하기</h1>
          <p className="text-xl max-w-2xl mx-auto">프로젝트에 대해 이야기하고 싶으신가요? 지금 연락주세요</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-6">연락처 정보</h2>
            <p className="text-muted-foreground mb-8">
              궁금한 점이 있으시거나 프로젝트에 대해 상담을 원하시면 아래 연락처로 문의해 주세요. 또는 문의 양식을
              작성하시면 빠른 시일 내에 답변 드리겠습니다.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">주소</h3>
                  <p className="text-muted-foreground">
                    서울특별시 강남구 테헤란로 123
                    <br />
                    인테리어 스튜디오 빌딩 5층
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">이메일</h3>
                  <p className="text-muted-foreground">info@interiorstudio.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-4 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">전화</h3>
                  <p className="text-muted-foreground">02-123-4567</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-3">영업 시간</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>월요일 - 금요일: 오전 9시 - 오후 6시</p>
                <p>토요일: 오전 10시 - 오후 3시 (예약제)</p>
                <p>일요일: 휴무</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">포트폴리오 다운로드</h3>
              <Button className="flex items-center">
                <Download className="mr-2 h-4 w-4" />
                포트폴리오 PDF 다운로드
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6">견적 문의</h2>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold mb-2">문의가 접수되었습니다!</h3>
                <p className="text-muted-foreground mb-4">
                  귀하의 문의가 성공적으로 접수되었습니다. 영업일 기준 1-2일 내에 답변 드리겠습니다.
                </p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline">
                  새 문의하기
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이름</FormLabel>
                          <FormControl>
                            <Input placeholder="홍길동" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>이메일</FormLabel>
                          <FormControl>
                            <Input placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>전화번호</FormLabel>
                        <FormControl>
                          <Input placeholder="01012345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>프로젝트 유형</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="프로젝트 유형 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="residential">주거 공간</SelectItem>
                              <SelectItem value="commercial">상업 공간</SelectItem>
                              <SelectItem value="office">오피스</SelectItem>
                              <SelectItem value="hospitality">호텔 & 리조트</SelectItem>
                              <SelectItem value="other">기타</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>예산 범위</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="예산 범위 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="under-10m">1천만원 미만</SelectItem>
                              <SelectItem value="10m-30m">1천만원 - 3천만원</SelectItem>
                              <SelectItem value="30m-50m">3천만원 - 5천만원</SelectItem>
                              <SelectItem value="50m-100m">5천만원 - 1억원</SelectItem>
                              <SelectItem value="over-100m">1억원 이상</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>메시지</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="프로젝트에 대해 자세히 알려주세요."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {submitError && <p className="text-sm text-red-600">{submitError}</p>}

                  <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "문의 접수 중..." : "문의하기"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">오시는 길</h2>
          <div className="max-w-4xl mx-auto h-[400px] bg-white rounded-lg overflow-hidden">
            <div className="w-full h-full relative">
              <Image
                src="/placeholder.svg?height=800&width=1200&query=map of seoul gangnam area"
                alt="Location Map"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <p className="font-semibold">인테리어 스튜디오</p>
                  <p className="text-sm text-muted-foreground">서울특별시 강남구 테헤란로 123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
