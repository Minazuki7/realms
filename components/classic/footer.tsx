import { getBio, getSettings } from "@/lib/cms-loader";

export async function ClassicFooter() {
  const bio = await getBio();
  const settings = await getSettings();

  if (!bio || !settings) {
    return <footer>Footer data not available</footer>;
  }

  return (
    <footer className="relative py-16 px-6 overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/8 to-accent/5 rounded-full blur-3xl opacity-30 animate-float" />
        <div
          className="absolute -bottom-1/2 right-1/3 w-80 h-80 bg-gradient-to-tl from-accent/6 to-primary/4 rounded-full blur-3xl opacity-25 animate-float"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 pb-8 border-b border-white/10">
          {/* Brand section */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {bio.name.split(" ")[0]}
            </h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Crafting digital experiences with cutting-edge technology and
              premium design.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Navigate
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "About", href: "#about" },
                { label: "Projects", href: "#projects" },
                { label: "Skills", href: "#skills" },
                { label: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-foreground/60 hover:text-primary smooth-transition flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/0 group-hover:bg-primary smooth-transition" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
              Connect
            </h4>
            <div className="flex gap-3">
              {Object.entries(settings.socials)
                .filter(([, url]) => url)
                .map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center smooth-transition hover:scale-110"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/15 opacity-0 group-hover:opacity-100 smooth-transition" />
                    <div className="absolute inset-0 border border-white/10 group-hover:border-primary/50 rounded-lg smooth-transition" />
                    <span className="relative z-10 text-foreground/70 group-hover:text-primary smooth-transition capitalize font-medium text-xs">
                      {platform.charAt(0).toUpperCase()}
                    </span>
                  </a>
                ))}
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground/50">
            © {new Date().getFullYear()} {bio.name}. All rights reserved.
          </p>
          <p className="text-sm text-foreground/50">
            Crafted with <span className="text-primary">✨</span> using
            cutting-edge technology
          </p>
        </div>
      </div>
    </footer>
  );
}
