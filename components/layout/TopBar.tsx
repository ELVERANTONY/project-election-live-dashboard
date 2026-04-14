import Image from "next/image";

const navLinks = [
  { label: "National Summary", active: true },
  { label: "Regional Heatmap", active: false },
  { label: "District Ticker", active: false },
];

export function TopBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary cursor-pointer select-none">
          menu
        </span>
        <h1 className="text-2xl font-bold tracking-tighter uppercase text-on-surface font-headline">
          The Digital Ledger
        </h1>
      </div>

      <div className="flex items-center gap-6 h-full">
        <nav className="hidden md:flex gap-8 h-full items-center font-label text-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              className={
                link.active
                  ? "text-primary border-b-2 border-primary h-full flex items-center px-1"
                  : "text-on-surface/60 hover:bg-surface-container-high transition-colors h-full flex items-center px-1"
              }
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high border border-outline-variant/20 shrink-0">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQzFzaNT4faqwbZzZius3u24eQRNunf2U9Ng_Knzj2Hi0NTa8R8aa-d9DKGxsalXJWoipfnm2lpWqn0j3BqgFW6z_bN_U1dLRlkJJPnJLmLooycke7r-3gd6Nl29E3N8ALjyX7M6BDPnqV0aNwVfpw9HMvU0ZRl46L5wJIaIG2lKcj0TLXI8mzOBUStxMN8c2Aq_iiHO6F2xKwrSCBopuJWdfSeKgQGIGDhhC4vIkVVQaYvgmds0zKDJv4paQl_cGhIoDGE0xEZ5k"
            alt="Profile"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
