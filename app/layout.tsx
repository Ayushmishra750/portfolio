import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ayush Mishra | Data Engineer | PySpark | AWS | Python',
  description: 'Senior Data Engineer with 3.5+ years building scalable data pipelines, ETL systems, and cloud-native solutions on AWS. Expert in PySpark, SQL, Python, and BigQuery.',
  keywords: ['Data Engineer', 'PySpark Developer', 'AWS Data Engineer', 'ETL Developer', 'SQL Developer', 'Python Developer', 'Big Data', 'Ayush Mishra'],
  authors: [{ name: 'Ayush Mishra', url: 'https://ayushmishra.dev' }],
  creator: 'Ayush Mishra',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ayushmishra.dev',
    title: 'Ayush Mishra | Data Engineer',
    description: 'Building Scalable Data Systems That Transform Raw Data Into Business Intelligence',
    siteName: 'Ayush Mishra Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayush Mishra | Data Engineer',
    description: 'Building Scalable Data Systems That Transform Raw Data Into Business Intelligence',
    creator: '@ayushmishra',
  },
  robots: { index: true, follow: true },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Ayush Mishra",
              "jobTitle": "Data Engineer",
              "description": "Data Engineer with 3.5+ years of experience in PySpark, AWS, and Python",
              "email": "ayushmishra750980@gmail.com",
              "address": { "@type": "PostalAddress", "addressLocality": "Noida", "addressCountry": "IN" },
              "knowsAbout": ["Data Engineering", "PySpark", "AWS", "Python", "SQL", "ETL", "Big Data"],
            })
          }}
        />
      </head>
      <body className="noise antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
