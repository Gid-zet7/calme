import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create psychologists
  const psychologists = await Promise.all([
    prisma.psychologist.create({
      data: {
        name: 'Dr. Emily Roberts',
        specialization: 'Anxiety & Stress Management',
        bio: 'Dr. Roberts specializes in evidence-based treatments for anxiety disorders, including CBT and exposure therapy. She has over 10 years of experience helping clients develop effective stress management strategies.',
        imageUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        email: 'emily.roberts@calme.org',
        phone: '+1-555-0101',
        availability: ['Monday', 'Wednesday', 'Friday'],
      },
    }),
    prisma.psychologist.create({
      data: {
        name: 'Dr. Marcus Williams',
        specialization: 'Depression & Mood Disorders',
        bio: 'With expertise in treating depression and bipolar disorder, Dr. Williams combines medication management with therapeutic approaches to help clients regain emotional balance and wellbeing.',
        imageUrl: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        email: 'marcus.williams@calme.org',
        phone: '+1-555-0102',
        availability: ['Tuesday', 'Thursday', 'Saturday'],
      },
    }),
    prisma.psychologist.create({
      data: {
        name: 'Dr. Sophia Patel',
        specialization: 'Child & Adolescent Psychology',
        bio: 'Dr. Patel works with children and teenagers facing emotional and behavioral challenges. She creates a safe, supportive environment where young people can express themselves and develop coping skills.',
        imageUrl: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        email: 'sophia.patel@calme.org',
        phone: '+1-555-0103',
        availability: ['Monday', 'Tuesday', 'Thursday'],
      },
    }),
  ]);

  console.log(`✅ Created ${psychologists.length} psychologists`);

  // Create news items
  const newsItems = await Promise.all([
    prisma.newsItem.create({
      data: {
        title: 'Cal-me Launches New Youth Mental Health Initiative',
        content: 'Cal-me is proud to announce the launch of our Youth Mental Health Initiative, a comprehensive program designed to support the mental wellbeing of young people in our community. Through partnerships with local schools, we will be providing resources, workshops, and direct support services to help teenagers navigate the unique mental health challenges they face today.\n\nThe program includes peer support training, teacher education on recognizing mental health issues, and direct counseling services for students in need. "Young people today face unprecedented pressures, and we need to ensure they have the tools and support to maintain good mental health," says Dr. Sarah Johnson, founder of Cal-me.\n\nThe initiative will begin next month in five pilot schools before expanding throughout the region.',
        summary: 'Cal-me partners with local schools to provide mental health resources and support for teenagers.',
        imageUrl: 'https://images.pexels.com/photos/8363104/pexels-photo-8363104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        author: 'Cal-me Communications Team',
        tags: ['Youth', 'Schools', 'Community Outreach'],
        isPublished: true,
        publishedAt: new Date('2024-04-12'),
      },
    }),
    prisma.newsItem.create({
      data: {
        title: 'Mental Health Awareness Month: Cal-me Hosts Free Webinar Series',
        content: 'In recognition of Mental Health Awareness Month this May, Cal-me will be hosting a series of free webinars every Wednesday covering a range of important mental health topics. Each session will be led by our expert psychologists and will include practical advice, Q&A opportunities, and resources for further support.\n\nTopics include managing anxiety, understanding depression, building resilience, and promoting workplace mental health. "We want to make quality mental health information accessible to everyone," explains Dr. Michael Chen, who will be leading several of the sessions.\n\nRegistration is now open on our website, and participants can join any or all of the webinars. All sessions will be recorded and made available on our Resources page for those unable to attend live.',
        summary: 'Join our experts throughout May for weekly webinars on various mental health topics.',
        imageUrl: 'https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        author: 'Cal-me Events Team',
        tags: ['Webinars', 'Mental Health Awareness Month', 'Education'],
        isPublished: true,
        publishedAt: new Date('2024-04-05'),
      },
    }),
  ]);

  console.log(`✅ Created ${newsItems.length} news items`);

  // Create programs
  const programs = await Promise.all([
    prisma.program.create({
      data: {
        title: 'Mental Health Awareness Workshop',
        description: 'A comprehensive workshop focusing on mental health awareness, stigma reduction, and practical self-care strategies for everyday life.',
        content: 'This workshop covers the basics of mental health, common conditions, warning signs, and practical strategies for maintaining good mental health. Participants will learn about stress management, emotional regulation, and when to seek professional help.',
        imageUrl: 'https://images.pexels.com/photos/7176319/pexels-photo-7176319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        date: new Date('2024-09-15T10:00:00Z'),
        location: 'Community Center, Downtown',
        isUpcoming: true,
        maxAttendees: 50,
        status: 'UPCOMING',
      },
    }),
    prisma.program.create({
      data: {
        title: 'Youth Mental Health First Aid',
        description: 'Training program designed to teach parents, family members, and caregivers how to help adolescents who are developing a mental health problem or experiencing a mental health crisis.',
        content: 'This comprehensive training covers recognizing signs of mental health problems in young people, providing initial help, and connecting them with appropriate professional care. Participants will receive a certificate upon completion.',
        imageUrl: 'https://images.pexels.com/photos/8942941/pexels-photo-8942941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        date: new Date('2024-10-20T09:00:00Z'),
        location: 'Cal-me Headquarters',
        isUpcoming: true,
        maxAttendees: 30,
        status: 'UPCOMING',
      },
    }),
  ]);

  console.log(`✅ Created ${programs.length} programs`);

  // Create resources
  const resources = await Promise.all([
    prisma.resource.create({
      data: {
        title: 'Understanding Anxiety',
        description: 'A comprehensive guide to understanding and managing anxiety disorders.',
        content: 'This detailed guide covers the different types of anxiety disorders, their symptoms, causes, and evidence-based treatment options. Includes practical exercises and coping strategies.',
        imageUrl: 'https://images.pexels.com/photos/3755761/pexels-photo-3755761.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        downloadUrl: '#',
        category: 'Anxiety',
        fileSize: 2048000, // 2MB
        fileType: 'PDF',
        isPublished: true,
        downloadCount: 150,
      },
    }),
    prisma.resource.create({
      data: {
        title: 'Depression: Signs and Support',
        description: 'Learn about the symptoms of depression and effective support strategies.',
        content: 'A comprehensive resource covering depression symptoms, warning signs, risk factors, and how to support someone experiencing depression. Includes self-help strategies and when to seek professional help.',
        imageUrl: 'https://images.pexels.com/photos/5699516/pexels-photo-5699516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        downloadUrl: '#',
        category: 'Depression',
        fileSize: 1800000, // 1.8MB
        fileType: 'PDF',
        isPublished: true,
        downloadCount: 120,
      },
    }),
    prisma.resource.create({
      data: {
        title: 'Stress Management Techniques',
        description: 'Practical techniques for managing stress in everyday life.',
        content: 'This resource provides evidence-based stress management techniques including mindfulness, breathing exercises, time management, and lifestyle changes to help reduce stress.',
        imageUrl: 'https://images.pexels.com/photos/897817/pexels-photo-897817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        downloadUrl: '#',
        category: 'Stress',
        fileSize: 1500000, // 1.5MB
        fileType: 'PDF',
        isPublished: true,
        downloadCount: 200,
      },
    }),
  ]);

  console.log(`✅ Created ${resources.length} resources`);

  // Create partners
  const partners = await Promise.all([
    prisma.partner.create({
      data: {
        name: 'Mindful Health Foundation',
        description: 'A non-profit organization dedicated to promoting mental health awareness and providing resources to underserved communities.',
        logoUrl: 'https://images.pexels.com/photos/6156397/pexels-photo-6156397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        websiteUrl: '#',
        isActive: true,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'Global Wellness Institute',
        description: 'An international research organization focused on preventive health and wellness initiatives worldwide.',
        logoUrl: 'https://images.pexels.com/photos/6156393/pexels-photo-6156393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        websiteUrl: '#',
        isActive: true,
      },
    }),
    prisma.partner.create({
      data: {
        name: 'City Hospital Network',
        description: 'A network of hospitals providing comprehensive healthcare services including mental health support and resources.',
        logoUrl: 'https://images.pexels.com/photos/6156400/pexels-photo-6156400.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        websiteUrl: '#',
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${partners.length} partners`);

  // Create testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Jane D.',
        role: 'Client',
        content: 'Cal-me changed my life. The therapist I was matched with understood exactly what I was going through and gave me practical tools to manage my anxiety. I\'m now able to face challenges that would have overwhelmed me before.',
        imageUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        rating: 5,
        isApproved: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Michael T.',
        role: 'Workshop Participant',
        content: 'The stress management workshop was eye-opening. I learned techniques I use daily in my high-pressure job. The presenters were knowledgeable and the material was accessible. Highly recommend Cal-me\'s programs!',
        imageUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        rating: 5,
        isApproved: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Sarah L.',
        role: 'Parent',
        content: 'Finding support for my teenager was so easy with Cal-me. The youth counselor built an amazing rapport with my son, who had been resistant to therapy. We\'ve seen remarkable progress in his confidence and emotional regulation.',
        rating: 5,
        isApproved: true,
      },
    }),
  ]);

  console.log(`✅ Created ${testimonials.length} testimonials`);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
