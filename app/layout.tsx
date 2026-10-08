import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'Set Room — Classroom SET Competition',description:'Find the sets. Beat the clock. Compete for the class pizza prize with daily puzzles and saved class leaderboards.',authors:[{name:'Rishik Rontala'}],icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
