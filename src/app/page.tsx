import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
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
  Globe,
  Trophy,
  MapPin,
  Phone,
  Mail,
  Sparkle
} from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const sections = [
    {
      title: 'Crèche/Playgroup',
      ageRange: '0-3 years',
      count: '22',
      description: 'A nurturing environment where our youngest learners develop through play-based activities, sensory experiences, and personalized attention in a safe, caring setting.',
      icon: Heart,
      gradient: 'from-rose-400 to-pink-500',
      lightColor: 'text-rose-500',
      bgLight: 'bg-rose-50',
      borderColor: 'border-rose-200',
      image: '/images/hero-creche.jpeg',
      features: ['Safe Environment', 'Early Learning', 'Play-based', 'Sensory Play'],
    },
    {
      title: 'Nursery',
      ageRange: '3-5 years',
      count: '54',
      description: 'Building foundational skills through structured activities, creative play, and social interaction, preparing children for a seamless transition to primary education.',
      icon: Sparkles,
      gradient: 'from-amber-400 to-orange-500',
      lightColor: 'text-amber-500',
      bgLight: 'bg-amber-50',
      borderColor: 'border-amber-200',
      image: '/images/hero-nursery.jpg',
      features: ['Activities', 'Rhymes', 'Real-life Experiences', 'Social Skills'],
    },
    {
      title: 'Primary',
      ageRange: '5-11 years',
      count: '65',
      description: 'Developing critical thinking and core academic skills through a comprehensive curriculum that balances traditional subjects with modern learning approaches.',
      icon: BookOpen,
      gradient: 'from-emerald-400 to-teal-500',
      lightColor: 'text-emerald-500',
      bgLight: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      image: '/images/hero-primary.jpg',
      features: ['Core Skills', 'Critical Thinking', 'Character Building', 'STEM'],
    },
    {
      title: 'College',
      ageRange: '11-16 years',
      count: '51',
      description: 'Preparing students for future success with a challenging curriculum that develops leadership, independence, and academic excellence for higher education.',
      icon: GraduationCap,
      gradient: 'from-blue-400 to-indigo-500',
      lightColor: 'text-blue-500',
      bgLight: 'bg-blue-50',
      borderColor: 'border-blue-200',
      image: '/images/hero-college.jpeg',
      features: ['Balanced Curriculum', 'Future Ready', 'Leadership', 'Excellence'],
    },
  ]

  const coreValues = [
    { name: 'Respect', icon: Users, description: 'Treating others with dignity and consideration', color: 'text-rose-600', bgColor: 'bg-rose-100' },
    { name: 'Responsibility', icon: Shield, description: 'Taking ownership of actions and learning', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { name: 'Resilience', icon: Award, description: 'Bouncing back from challenges stronger', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
    { name: 'Aspiration', icon: Target, description: 'Dreaming big and working towards goals', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Independence', icon: Star, description: 'Developing self-reliance and confidence', color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { name: 'Kindness', icon: Heart, description: 'Showing compassion and care for others', color: 'text-pink-600', bgColor: 'bg-pink-100' },
  ]

  const stats = [
    { value: '25+', label: 'Years of Excellence', icon: Award },
    { value: '163', label: 'Students Enrolled', icon: Users },
    { value: '50+', label: 'Qualified Staff', icon: GraduationCap },
    { value: '98%', label: 'Success Rate', icon: CheckCircle2 },
  ]

  const testimonials = [
    {
      quote: "Vincollins has transformed my children's educational journey. The teachers' dedication and the nurturing environment have helped them thrive academically and personally.",
      author: "Mrs. Adebayo",
      role: "Parent of Two",
      rating: 5,
    },
    {
      quote: "The holistic development approach at Vincollins has shaped my daughter's character beautifully. She's become more confident, responsible, and eager to learn.",
      author: "Mr. Okonkwo",
      role: "Parent",
      rating: 5,
    },
    {
      quote: "I've watched my son grow from a shy boy into a confident young leader. The values instilled at Vincollins are priceless and will serve him for life.",
      author: "Dr. Eze",
      role: "Parent",
      rating: 5,
    },
  ]

  // Generate deterministic values for animations
  const particlePositions = Array.from({ length: 20 }, (_, i) => ({
    left: `${(i * 7) % 100}%`,
    top: `${(i * 13) % 100}%`,
    delay: `${(i * 0.3) % 5}s`,
    duration: `${3 + (i % 5)}s`,
  }))

  const floatPositions = Array.from({ length: 15 }, (_, i) => ({
    left: `${(i * 11) % 100}%`,
    top: `${(i * 17) % 100}%`,
    delay: `${(i * 0.4) % 5}s`,
    duration: `${5 + (i % 5)}s`,
  }))

  const sparklePositions = Array.from({ length: 10 }, (_, i) => ({
    left: `${(i * 19) % 100}%`,
    top: `${(i * 23) % 100}%`,
    delay: `${(i * 0.5) % 3}s`,
    duration: `${2 + (i % 3)}s`,
  }))

  return (
    <main className="flex-1 overflow-x-hidden"> {/* Added overflow-x-hidden */}
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-amber-50">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        
        {/* Floating particles - deterministic positions */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particlePositions.map((pos, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float-particle"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.delay,
                animationDuration: pos.duration,
              }}
            />
          ))}
        </div>
        
        <Container className="relative py-12 lg:py-20 px-4 sm:px-6"> {/* Adjusted padding */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 lg:space-y-8 animate-fade-in-up max-w-full">
              <div className="inline-flex items-center gap-2 sm:gap-3 bg-primary/10 text-primary px-4 sm:px-5 py-2 rounded-full border border-primary/20 shadow-sm animate-fade-in-left">
                <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-success"></span>
                </span>
                <span className="text-xs sm:text-sm font-medium tracking-wide">Est. 1995 • Excellence in Education</span>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#0A2472] leading-tight animate-fade-in-right">
                  Vincollins
                  <span className="block text-secondary mt-1 sm:mt-2">Schools</span>
                </h1>
                <p className="font-script text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-secondary leading-relaxed animate-float">
                  Geared Towards Success
                </p>
              </div>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed animate-fade-in-up animation-delay-500">
                Providing a positive, safe and stimulating environment where every child can learn, 
                achieve their potential and become independent life-long learners.
              </p>
              
              {/* Single CTA Button */}
              <div className="pt-2 sm:pt-4 animate-fade-in-up animation-delay-700">
                <Button 
                  size="lg" 
                  className="group bg-[#0A2472] hover:bg-[#0A2472]/90 text-white shadow-lg hover:shadow-xl transition-all px-6 sm:px-10 py-4 sm:py-6 text-sm sm:text-base font-semibold hover:scale-105 w-full sm:w-auto"
                  asChild
                >
                  <Link href="/academics">
                    Explore Academics
                    <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 sm:gap-6 pt-4 sm:pt-8 animate-fade-in-up animation-delay-900 flex-wrap">
                <div className="flex -space-x-2 sm:-space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white shadow-lg animate-float"
                      style={{ 
                        animationDelay: `${i * 0.15}s`,
                        animationDuration: '3s'
                      }}
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm">
                  <span className="font-bold text-blue-600">500+</span>{' '}
                  <span className="text-muted-foreground">families trust Vincollins</span>
                </p>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative animate-fade-in-right">
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group">
                <Image
                  src="/images/hero-student.jpg"
                  alt="Vincollins School Campus"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                
                {/* Achievement badge */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/90 backdrop-blur-sm text-foreground px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium shadow-lg border border-white animate-float animation-delay-1000 hover:scale-105 transition-transform">
                  ⭐ Top Rated School 2024
                </div>

                {/* Floating sparkles */}
                <Sparkle className="absolute top-10 left-10 sm:top-20 sm:left-20 h-4 w-4 sm:h-6 sm:w-6 text-yellow-400 animate-sparkle" />
                <Sparkle className="absolute bottom-10 right-10 sm:bottom-20 sm:right-20 h-5 w-5 sm:h-8 sm:w-8 text-secondary animate-sparkle animation-delay-500" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#0A2472] text-white py-12 sm:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        
        <Container className="px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index} 
                  className="text-center group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-white/10 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-4 backdrop-blur-sm group-hover:scale-110 transition-all group-hover:bg-white/20 group-hover:rotate-3">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-secondary group-hover:animate-bounce" />
                  </div>
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2 group-hover:scale-110 transition-transform">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-white/80 uppercase tracking-wide">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </Container>
      </section>

      {/* School Sections */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
        <Container className="px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-0 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium animate-fade-in-down">Our Schools</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#0A2472] animate-fade-in-up">
              Academic Excellence Across All Ages
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-in-up animation-delay-300 px-4">
              From early years to college preparation, our comprehensive curriculum nurtures every child's unique potential.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <Card 
                  key={section.title}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Image section */}
                  <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Count badge */}
                    <Badge className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/95 text-foreground border-0 shadow-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm animate-float">
                      {section.count} Students
                    </Badge>
                    
                    {/* Icon */}
                    <div className={`absolute bottom-3 left-3 sm:bottom-4 sm:left-4 ${section.bgLight} p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${section.lightColor} group-hover:animate-pulse`} />
                    </div>
                  </div>
                  
                  <CardContent className="p-4 sm:p-5 lg:p-6">
                    <div className="mb-2 sm:mb-3 lg:mb-4">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-serif font-bold mb-0.5 sm:mb-1 group-hover:text-primary transition-colors">{section.title}</h3>
                      <p className="text-xs sm:text-sm font-medium text-primary tracking-wide">{section.ageRange}</p>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                      {section.description}
                    </p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {section.features.map((feature, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] sm:text-xs bg-muted/80 px-2 sm:px-3 py-1 rounded-full text-muted-foreground font-medium hover:bg-primary hover:text-white transition-colors"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs sm:text-sm font-semibold text-primary hover:text-primary/80 hover:no-underline group-hover:translate-x-2 transition-transform" 
                      asChild
                    >
                      <Link href={`/academics/${section.title.toLowerCase()}`}>
                        Learn more 
                        <ChevronRight className="ml-0.5 sm:ml-1 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 sm:py-20 lg:py-28">
        <Container className="px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Vision Card */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-primary/5 to-transparent p-6 sm:p-8 lg:p-10 animate-fade-in-left">
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-secondary/10 rounded-full blur-2xl animate-pulse animation-delay-1000" />
              
              <div className="relative">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                  <div className="p-3 sm:p-4 bg-primary/10 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                    <Target className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary group-hover:animate-pulse" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2472]">Our Vision</h3>
                </div>
                
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-foreground/80 mb-6 sm:mb-8 lg:mb-10">
                  To nurture <span className="font-semibold text-primary">happy, successful children</span> by providing a positive, 
                  safe and stimulating environment where every child is valued and empowered to become an 
                  independent, life-long learner.
                </p>
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <div className="bg-primary/5 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl hover:scale-105 transition-transform">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">25+</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Years of Excellence</p>
                  </div>
                  <div className="bg-primary/5 p-3 sm:p-4 lg:p-5 rounded-lg sm:rounded-xl hover:scale-105 transition-transform">
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">100%</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">Pass Rate</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Mission Card */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-secondary/5 to-transparent p-6 sm:p-8 lg:p-10 animate-fade-in-right">
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-1500" />
              <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-primary/10 rounded-full blur-2xl animate-pulse animation-delay-2000" />
              
              <div className="relative">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
                  <div className="p-3 sm:p-4 bg-secondary/10 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300 group-hover:-rotate-3">
                    <Trophy className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-secondary group-hover:animate-bounce" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2472]">Our Mission</h3>
                </div>
                
                <p className="font-script text-2xl sm:text-3xl text-secondary mb-4 sm:mb-6 animate-float">
                  Dream, Believe, Achieve.
                </p>
                
                <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-foreground/80 mb-6 sm:mb-8 lg:mb-10">
                  To provide students with <span className="font-semibold text-foreground">high-quality learning experiences</span> 
                  through a broad, balanced curriculum that prepares them for adult responsibility in the modern world.
                </p>
                
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 lg:gap-8 text-secondary">
                  <div className="flex items-center gap-2 sm:gap-3 hover:scale-110 transition-transform">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 animate-pulse" />
                    <span className="text-xs sm:text-sm font-medium">Global</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 hover:scale-110 transition-transform">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 animate-pulse animation-delay-500" />
                    <span className="text-xs sm:text-sm font-medium">Balanced</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 hover:scale-110 transition-transform">
                    <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 animate-pulse animation-delay-1000" />
                    <span className="text-xs sm:text-sm font-medium">Future Ready</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Core Values */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
        <Container className="px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <Badge className="mb-4 sm:mb-6 bg-accent/10 text-accent border-0 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium animate-fade-in-down">Our Foundation</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#0A2472] animate-fade-in-up">
              Six Core Values
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-in-up animation-delay-300 px-4">
              Guiding principles that shape our community and develop character in every student.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon
              return (
                <Card 
                  key={value.name}
                  className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white text-center p-4 sm:p-5 lg:p-8 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`mb-3 sm:mb-4 lg:mb-5 mx-auto w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl sm:rounded-2xl ${value.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6`}>
                    <Icon className={`h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 ${value.color} group-hover:animate-pulse`} />
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm lg:text-lg mb-1 sm:mb-2 text-[#0A2472] group-hover:text-primary transition-colors">{value.name}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed hidden sm:block">{value.description}</p>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[#0A2472] opacity-5" />
        <div className="absolute top-0 left-0 w-full h-32 sm:h-48 lg:h-64 bg-gradient-to-b from-white to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-primary/10 rounded-full animate-float"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.delay,
                animationDuration: pos.duration,
              }}
            />
          ))}
        </div>
        
        <Container className="relative px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <Badge className="mb-4 sm:mb-6 bg-primary/10 text-primary border-0 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium animate-fade-in-down">Testimonials</Badge>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-[#0A2472] animate-fade-in-up">
              What Parents Say
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground animate-fade-in-up animation-delay-300 px-4">
              Hear from our community of parents and guardians about their experience with Vincollins Schools.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white p-5 sm:p-6 lg:p-8 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Quote icon */}
                <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-primary/5 animate-pulse" />
                
                {/* Rating */}
                <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-4 lg:mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400 animate-pulse" 
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-sm sm:text-base lg:text-lg text-foreground/80 leading-relaxed mb-4 sm:mb-6 lg:mb-8 italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                
                {/* Author */}
                <div className="relative">
                  <p className="font-bold text-base sm:text-lg lg:text-xl text-[#0A2472] group-hover:text-primary transition-colors">{testimonial.author}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-[#0A2472] py-16 sm:py-20 lg:py-28">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        
        {/* Floating sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {sparklePositions.map((pos, i) => (
            <Sparkle
              key={i}
              className="absolute h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-white/20 animate-sparkle"
              style={{
                left: pos.left,
                top: pos.top,
                animationDelay: pos.delay,
                animationDuration: pos.duration,
              }}
            />
          ))}
        </div>
        
        <Container className="relative px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 sm:mb-6 lg:mb-8 bg-white/20 text-white border-0 px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:bg-white/30 transition-colors animate-fade-in-down">
              Join Us Today
            </Badge>
            
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 lg:mb-8 text-white leading-tight animate-fade-in-up">
              Join the Vincollins Community
            </h2>
            
            <p className="text-sm sm:text-base lg:text-xl text-white/90 mb-6 sm:mb-8 lg:mb-12 leading-relaxed max-w-2xl mx-auto px-4 animate-fade-in-up animation-delay-300">
              Experience excellence in education. Apply now to begin your journey with Vincollins Schools.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 lg:gap-6 animate-fade-in-up animation-delay-500 px-4">
              <Button 
                size="lg" 
                className="bg-secondary text-white hover:bg-secondary/90 shadow-xl hover:shadow-2xl px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-sm sm:text-base lg:text-lg font-semibold transition-all hover:scale-105 group w-full sm:w-auto"
                asChild
              >
                <Link href="/admissions">
                  Apply Now
                  <ArrowRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white/10 hover:text-white px-6 sm:px-8 lg:px-10 py-4 sm:py-5 lg:py-6 text-sm sm:text-base lg:text-lg font-semibold transition-all hover:scale-105 w-full sm:w-auto"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 lg:mt-16 pt-4 sm:pt-6 lg:pt-8 border-t border-white/20 animate-fade-in-up animation-delay-700">
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-white/80 hover:text-white hover:scale-105 transition-all group">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-secondary group-hover:animate-bounce" />
                <span className="text-xs sm:text-sm lg:text-base">+234 800 123 4567</span>
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-white/80 hover:text-white hover:scale-105 transition-all group">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-secondary group-hover:animate-bounce" />
                <span className="text-xs sm:text-sm lg:text-base">info@vincollins.edu.ng</span>
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-white/80 hover:text-white hover:scale-105 transition-all group sm:col-span-2 md:col-span-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-secondary group-hover:animate-bounce" />
                <span className="text-xs sm:text-sm lg:text-base">Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  )
}