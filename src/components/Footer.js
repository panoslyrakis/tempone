import React from 'react';
import config from '../../config';
export default function Footer() {
  return (
    <footer id="footer">
      <div className="inner">
        <section>
          <h2>Follow</h2>
          <ul className="icons">
            {config.socialLinks.map(social => {
              const { icon, name, url } = social;
              return (
                <li key={url}>
                  <a href={url} className={`icon ${icon}`}>
                    <span className="label">{name}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
        <ul className="copyright">
          <li>&copy; WPMU DEV. All rights reserved</li>
        </ul>
      </div>
    </footer>
  );
}
