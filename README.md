# Satchel

A playful demo showcasing [web-haptics](https://haptics.lochie.me/) — tap illustrated toys to feel different haptic feedback patterns on mobile.

**[Try it live](https://satchel.noahfarrar.me)**

![](OG.png)

## Toys

Each toy triggers a unique haptic pattern and tap animation:

| Toy | Haptic | Animation |
| --- | --- | --- |
| Potion | `error` | buzz |
| Carrot | `nudge` | wobble |
| Map | `success` | pop |
| Skull | `buzz` | headshake |

Tapping also bursts themed SVG particles (stars, hearts, coins, skulls) rendered on a canvas overlay.

## Stack

- **React 19** + **Vite 7**
- [web-haptics](https://haptics.lochie.me/) for haptic feedback
- [qr-code-styling](https://github.com/nicolo-ribaudo/qr-code-styling) for the QR code (desktop only, links to mobile demo)
- Custom SVG illustrations
- CSS keyframe animations (idle rocking/floating, tap reactions, particle physics)

## Getting Started

```bash
cd haptic-app
npm install
npm run dev
```

Open on your phone (or scan the QR code on desktop) to feel the haptics.

## Credits

- Illustrations and site by [@noahfarrar](https://x.com/noahfarrar)
- Built with [web-haptics](https://haptics.lochie.me/) by [@lochieaxon](https://x.com/lochieaxon) & [@alexvanderzon](https://x.com/alexvanderzon)
