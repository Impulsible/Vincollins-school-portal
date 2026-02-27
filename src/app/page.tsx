import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Image from 'next/image'
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Award, 
  ArrowRight, 
  Heart, 
  Shield, 
  Sparkles,
  Target,
  Star,
  CheckCircle2,
  ChevronRight,
  Quote,
  BookMarked,
  Globe,
  Trophy
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const sections = [
    {
      title: 'Creche/Playgroup',
      ageRange: '0-3 years',
      count: '22',
      description: 'The crèche/playgroup class of Vincollins School is designed to support early development in preparation for participation in school and society programmes designed for children below the age of 3 years.',
      icon: Heart,
      color: 'from-rose-400 to-pink-500',
      lightColor: 'text-rose-500',
      bgLight: 'bg-rose-50',
      borderColor: 'border-rose-200',
      image: '/images/hero-creche.jpeg',
      features: ['Safe Environment', 'Early Learning', 'Play-based'],
    },
    {
      title: 'Nursery',
      ageRange: '3-5 years',
      count: '54',
      description: 'The nursery class is designed to support early development in preparation for participation in school and society programmes designed for children from 3 years to the start of primary education.',
      icon: Sparkles,
      color: 'from-amber-400 to-orange-500',
      lightColor: 'text-amber-500',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-200',
      image: '/images/hero-nursery.jpg',
      features: ['Activities', 'Rhymes', 'Real-life Experiences'],
    },
    {
      title: 'Primary',
      ageRange: '5-11 years',
      count: '65',
      description: 'Our primary school is designed to support early development in preparation for participation in school and society. Our programmes provide fundamental skills in reading, writing, and mathematics.',
      icon: BookOpen,
      color: 'from-emerald-400 to-teal-500',
      lightColor: 'text-emerald-500',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      image: '/images/hero-primary.jpg',
      features: ['Core Skills', 'Critical Thinking', 'Character Building'],
    },
    {
      title: 'College',
      ageRange: '11-16 years',
      count: '51',
      description: 'The school aims to offer a challenging and balanced education which will prepare its students for adult responsibility in the modern world, incorporating new ideas and developments.',
      icon: GraduationCap,
      color: 'from-blue-400 to-indigo-500',
      lightColor: 'text-blue-500',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-200',
      image: '/images/hero-college.jpeg',
      features: ['Balanced Curriculum', 'Future Ready', 'Leadership'],
    },
  ]

  const coreValues = [
    { name: 'Respect', icon: Users, description: 'Treating others with dignity', color: 'text-rose-500', bgColor: 'bg-rose-50', gradient: 'from-rose-400 to-pink-500' },
    { name: 'Responsibility', icon: Shield, description: 'Taking ownership', color: 'text-amber-500', bgColor: 'bg-amber-50', gradient: 'from-amber-400 to-orange-500' },
    { name: 'Resilience', icon: Award, description: 'Bouncing back stronger', color: 'text-emerald-500', bgColor: 'bg-emerald-50', gradient: 'from-emerald-400 to-teal-500' },
    { name: 'Aspiration', icon: Target, description: 'Dreaming big', color: 'text-blue-500', bgColor: 'bg-blue-50', gradient: 'from-blue-400 to-indigo-500' },
    { name: 'Independence', icon: Star, description: 'Self-reliance', color: 'text-purple-500', bgColor: 'bg-purple-50', gradient: 'from-purple-400 to-pink-500' },
    { name: 'Kindness', icon: Heart, description: 'Compassion for others', color: 'text-pink-500', bgColor: 'bg-pink-50', gradient: 'from-pink-400 to-rose-500' },
  ]

  const stats = [
    { label: 'Years of Excellence', value: '25+', icon: Award, color: 'text-amber-500', bgColor: 'bg-amber-100' },
    { label: 'Students Enrolled', value: '163', icon: Users, color: 'text-emerald-500', bgColor: 'bg-emerald-100' },
    { label: 'Qualified Staff', value: '50+', icon: GraduationCap, color: 'text-blue-500', bgColor: 'bg-blue-100' },
    { label: 'Success Rate', value: '98%', icon: CheckCircle2, color: 'text-purple-500', bgColor: 'bg-purple-100' },
  ]

  const testimonials = [
    {
      quote: "Vincollins has provided my children with an exceptional education. The teachers are dedicated and the environment is nurturing.",
      author: "Mrs. Adebayo",
      role: "Parent of Two",
      rating: 5,
    },
    {
      quote: "The school's focus on holistic development has helped my child grow academically and personally. The values they instill are priceless.",
      author: "Mr. Okonkwo",
      role: "Parent",
      rating: 5,
    },
    {
      quote: "I've seen tremendous improvement in my daughter's confidence and academic performance since joining Vincollins.",
      author: "Dr. Eze",
      role: "Parent",
      rating: 5,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50 py-16 lg:py-24">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
          
          <Container className="relative max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  <span className="text-sm font-medium">Est. 1995 • Excellence in Education</span>
                </div>
                
                <div className="flex flex-col">
                  <h1 className="font-serif text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl text-[#0A2472]">
                    Vincollins Schools
                  </h1>
                  <span className="font-script text-3xl text-secondary sm:text-4xl mt-2 animate-float">
                    Geared Towards Success
                  </span>
                </div>
                
                <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Providing a positive, safe and stimulating environment where every child can learn, 
                  achieve their potential and become independent life-long learners.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button size="lg" className="group shadow-lg hover:shadow-xl transition-all px-8 py-6 text-base" asChild>
                    <Link href="/academics">
                      Explore Academics
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 px-8 py-6 text-base" asChild>
                    <Link href="/login">Parent Portal</Link>
                  </Button>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  {stats.slice(0, 3).map((stat, index) => {
                    return (
                      <div key={index} className="text-center">
                        <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                        <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative">
                <div className="relative w-full h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/hero-school.jpg"
                    alt="Vincollins School Campus"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  
                  {/* Floating card */}
                  <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 max-w-[240px] border border-white/20">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/20">
                        <Image
                          src="/images/hero-student.jpg"
                          alt="Student"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">98%</p>
                        <p className="text-sm text-muted-foreground">Success Rate</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievement badge */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg border border-white">
                    ⭐ Top Rated School 2024
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* School Sections - Beautiful Cards */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <Container className="max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-0 px-4 py-1">Our Schools</Badge>
              <h2 className="font-serif text-4xl font-bold sm:text-5xl mb-4">
                Academic Sections
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Comprehensive education from early years through college, tailored to each developmental stage
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <Card 
                    key={section.title}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Image section */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={section.image}
                        alt={section.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      
                      {/* Count badge */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        {section.count} Students
                      </div>
                      
                      {/* Icon */}
                      <div className={`absolute bottom-4 left-4 ${section.bgLight} p-3 rounded-xl shadow-lg`}>
                        <Icon className={`h-6 w-6 ${section.lightColor}`} />
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold font-serif mb-1">{section.title}</h3>
                        <p className="text-sm text-primary font-medium">{section.ageRange}</p>
                      </div>
                      
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {section.description}
                      </p>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {section.features.map((feature, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        className="p-0 h-auto font-semibold text-primary hover:text-primary/80 hover:bg-transparent group-hover:translate-x-2 transition-transform" 
                        asChild
                      >
                        <Link href={`/academics/${section.title.toLowerCase()}`}>
                          Learn more 
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </Container>
        </section>

        {/* Vision & Mission - Beautiful Cards */}
        <section className="py-24">
          <Container className="max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Vision Card */}
              <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <Target className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-serif">Our Vision</CardTitle>
                  </div>
                  
                  <p className="text-lg leading-relaxed text-foreground/80 mb-8">
                    At the Vincollins Schools, we believe that a happy child is a successful one. 
                    We are committed to providing a positive, safe and stimulating environment for 
                    children to learn, where all are valued.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary/5 p-4 rounded-xl">
                      <p className="text-2xl font-bold text-primary">25+</p>
                      <p className="text-sm text-muted-foreground">Years of Excellence</p>
                    </div>
                    <div className="bg-primary/5 p-4 rounded-xl">
                      <p className="text-2xl font-bold text-primary">100%</p>
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mission Card */}
              <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-4 bg-secondary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <Trophy className="h-10 w-10 text-secondary" />
                    </div>
                    <CardTitle className="text-3xl font-serif">Our Mission</CardTitle>
                  </div>
                  
                  <p className="text-2xl font-bold text-secondary mb-4">
                    DREAM, BELIEVE, ACHIEVE.
                  </p>
                  
                  <p className="text-lg leading-relaxed text-foreground/80 mb-8">
                    We aim to ensure that the students & children at our school are provided with 
                    high-quality learning experiences based on a broad and balanced curriculum.
                  </p>
                  
                  <div className="flex items-center gap-6 text-secondary">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      <span className="text-sm">Global</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookMarked className="h-5 w-5" />
                      <span className="text-sm">Balanced</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      <span className="text-sm">Future Ready</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </section>

        {/* Core Values - Beautiful Cards */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <Container className="max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-accent/10 text-accent border-0 px-4 py-1">Our Foundation</Badge>
              <h2 className="font-serif text-4xl font-bold sm:text-5xl mb-4">
                Six Core Values
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Guiding principles that shape our community and develop character
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {coreValues.map((value) => {
                const Icon = value.icon
                return (
                  <Card 
                    key={value.name}
                    className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    <CardContent className="p-6 text-center">
                      <div className={`mb-4 mx-auto w-16 h-16 rounded-2xl ${value.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-8 w-8 ${value.color}`} />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{value.name}</h3>
                      <p className="text-xs text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </Container>
        </section>

        {/* Testimonials - Beautiful Cards */}
        <section className="py-24">
          <Container className="max-w-7xl">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-primary/10 text-primary border-0 px-4 py-1">Testimonials</Badge>
              <h2 className="font-serif text-4xl font-bold sm:text-5xl mb-4">
                What Parents Say
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Hear from our community of parents and guardians about their experience
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index}
                  className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                  <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/10" />
                  
                  <CardContent className="p-8">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    {/* Quote */}
                    <p className="text-lg text-foreground/80 leading-relaxed mb-8 italic">
                      "{testimonial.quote}"
                    </p>
                    
                    {/* Author */}
                    <div>
                      <p className="font-bold text-lg text-primary">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground mt-1">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA Section - Matching Header Blue */}
        <section className="relative overflow-hidden bg-[#0A2472] py-24">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          
          <Container className="relative max-w-5xl">
            <div className="text-center">
              <Badge className="mb-6 bg-white/20 text-white border-0 px-4 py-1 hover:bg-white/30">
                Join Us Today
              </Badge>
              
              <h2 className="font-serif text-4xl font-bold sm:text-5xl lg:text-6xl mb-6 text-white">
                Join the Vincollins Community
              </h2>
              
              <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
                Experience excellence in education. Apply now or access the parent portal to begin your journey with Vincollins Schools.
              </p>
              
              <div className="flex flex-wrap justify-center gap-6">
                <Button 
                  size="lg" 
                  className="bg-secondary text-white hover:bg-secondary/90 shadow-lg hover:shadow-xl px-10 py-6 text-lg font-semibold transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/admissions">
                    Apply Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white px-10 py-6 text-lg font-semibold transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mt-16 pt-8 border-t border-white/20">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-sm text-white/70 mt-1">{stat.label}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}