export const mainNavItems = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'About Us',
    href: '/about',
    children: [
      { title: 'Our Vision', href: '/about/vision' },
      { title: 'Our Mission', href: '/about/mission' },
      { title: 'Core Values', href: '/about/values' },
    ],
  },
  {
    title: 'Academics',
    href: '/academics',
    children: [
      { title: 'Creche/Playgroup', href: '/academics/creche' },
      { title: 'Nursery', href: '/academics/nursery' },
      { title: 'Primary', href: '/academics/primary' },
      { title: 'College', href: '/academics/college' },
    ],
  },
  {
    title: 'Portal',
    href: '/login',
  },
  {
    title: 'Contact',
    href: '/contact',
  },
]

export const footerNavItems = {
  academics: [
    { title: 'Creche/Playgroup', href: '/academics/creche' },
    { title: 'Nursery', href: '/academics/nursery' },
    { title: 'Primary', href: '/academics/primary' },
    { title: 'College', href: '/academics/college' },
  ],
  about: [
    { title: 'Our Vision', href: '/about/vision' },
    { title: 'Our Mission', href: '/about/mission' },
    { title: 'Core Values', href: '/about/values' },
    { title: 'History', href: '/about/history' },
  ],
  resources: [
    { title: 'News & Events', href: '/news' },
    { title: 'Gallery', href: '/gallery' },
    { title: 'FAQs', href: '/faqs' },
    { title: 'Contact Us', href: '/contact' },
  ],
  portal: [
    { title: 'Student Login', href: '/login' },
    { title: 'Staff Login', href: '/login' },
    { title: 'Admin Login', href: '/login' },
    { title: 'Parent Portal', href: '/parent' },
  ],
}