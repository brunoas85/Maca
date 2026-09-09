export function Footer() {
  return (
    <footer className="border-t border-line px-4 py-6 text-center text-xs text-ink-soft">
      <p>
        Foto de macá tobiano:{" "}
        <a
          href="https://commons.wikimedia.org/wiki/File:Podiceps_gallardoi_-_Francisco_Gonz%C3%A1lez_T%C3%A1boas_(1).jpg"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          Francisco González Táboas
        </a>
        , licencia{" "}
        <a
          href="https://creativecommons.org/licenses/by-sa/4.0/"
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          CC BY-SA 4.0
        </a>
        .
      </p>
    </footer>
  );
}
