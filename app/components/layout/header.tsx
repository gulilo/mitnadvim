import Link from 'next/link';

export default function Header() {
  return (
    <nav className="flex justify-center items-center p-4 bg-gray-100">
      <ul className="flex space-x-8 list-none">
        <li><Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link></li>
        <li><Link href="/about" className="text-blue-600 hover:text-blue-800">About</Link></li>
        <li><Link href="/services" className="text-blue-600 hover:text-blue-800">Services</Link></li>
        <li><Link href="/contact" className="text-blue-600 hover:text-blue-800">Contact</Link></li>
      </ul>
    </nav>
  );
}
