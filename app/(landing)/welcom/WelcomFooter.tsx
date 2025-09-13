export default function WelcomFooter() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-8 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* 로고/카피라이트 */}
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-bold text-white">Mug-in</h3>
          <p className="text-sm">© {new Date().getFullYear()} Mug-in. All rights reserved.</p>
        </div>

        {/* 네비게이션 */}
        <div className="flex space-x-6 text-sm">
          <a href="/about" className="hover:text-white">About</a>
          <a href="/features" className="hover:text-white">Features</a>
          <a href="/contact" className="hover:text-white">Contact</a>
        </div>

        {/* 소셜 링크 */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="https://twitter.com" target="_blank" className="hover:text-white">Twitter</a>
          <a href="https://instagram.com" target="_blank" className="hover:text-white">Instagram</a>
          <a href="https://facebook.com" target="_blank" className="hover:text-white">Facebook</a>
        </div>
      </div>
    </footer>
  );
}
