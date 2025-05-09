"use client"

import { CartProvider } from '../contexts/CartContext'
import { ToastProvider } from '../contexts/ToastContext'
import BackToTopButton from './BackToTopButton'
import Header from './Header'
import Footer from './Footer'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ClientProviders({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    /* Scroll reveal */
    const observer = new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:0.1});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

    /* Ripple clicks */
    const handleClick = (e)=>{
      const target = e.target.closest('.btn-ripple, .btn-primary, .btn-minimal-primary, .btn-minimal-secondary');
      if(!target) return;
      const rect = target.getBoundingClientRect();
      const span = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      span.className='ripple';
      span.style.width=span.style.height=`${size}px`;
      span.style.left=`${e.clientX - rect.left}px`;
      span.style.top=`${e.clientY - rect.top}px`;
      target.appendChild(span);
      span.addEventListener('animationend',()=>span.remove());
    };
    document.addEventListener('click',handleClick);

    return ()=>{
      observer.disconnect();
      document.removeEventListener('click',handleClick);
    }
  },[pathname]);

  return (
    <CartProvider>
      <ToastProvider>
        <Header />
        {children}
        <Footer />
        <BackToTopButton />
      </ToastProvider>
    </CartProvider>
  )
} 