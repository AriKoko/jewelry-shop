import { Heebo } from 'next/font/google'
import '../styles/globals.css'
import ClientProviders from '../components/ClientProviders'

const heebo = Heebo({ 
  subsets: ['latin', 'hebrew'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-heebo'
})

export const metadata = {
  title: 'Jewelry Shop - תכשיטים בעיצוב אישי',
  description: 'חנות תכשיטים מעוצבים בהתאמה אישית, שרשראות, צמידים, עגילים ומדבקות לטלפון',
}

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.className} bg-neutral-100 min-h-screen flex flex-col relative`}>
        {/* רקע דקורטיבי קבוע עם אפקטים */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* אפקט גלים מונפשים - עם תנועה מופחתת */}
          <div className="absolute top-1/3 right-1/3 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl transform opacity-20"></div>
          <div className="absolute bottom-1/3 left-1/3 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl transform opacity-20"></div>
          
          {/* תבנית נקודות עדינה לרקע */}
          <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
        </div>
        
        <ClientProviders>
          <main className="flex-grow pt-28 pb-8 relative z-10">{children}</main>
        </ClientProviders>
      </body>
    </html>
  )
} 