# 💜 Aligned - Dating App

A modern dating app built with React Native and Expo. Connect with people who share your values and interests!

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NativeWind](https://img.shields.io/badge/NativeWind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **🏠 Home** - Discover potential matches with swipeable profile cards
- **⭐ Standouts** - View featured profiles that stand out
- **❤️ Likes** - See who's interested in you
- **� Matches** - Chat with your matches
- **👤 Profile** - Manage your profile and preferences

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Expo](https://expo.dev/) | React Native framework with file-based routing |
| [NativeWind](https://www.nativewind.dev/) | Tailwind CSS for React Native |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Reanimated](https://docs.swmansion.com/react-native-reanimated/) | Smooth animations |
| [NunitoSans](https://fonts.google.com/specimen/Nunito+Sans) | Custom typography |

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/subhdotsol/Aligned.git
   cd Aligned
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `a` for Android emulator / `i` for iOS simulator

## � Project Structure

```
aligned/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── _layout.tsx    # Tab bar configuration
│   │   ├── index.tsx      # Home screen
│   │   ├── start.tsx      # Standouts screen
│   │   ├── likes.tsx      # Likes screen
│   │   ├── chats.tsx      # Matches/Chats screen
│   │   └── profile.tsx    # Profile screen
│   ├── _layout.tsx        # Root layout with fonts
│   └── globals.css        # Global styles
├── assets/
│   ├── fonts/             # NunitoSans font files
│   └── icons/             # Custom tab bar icons
├── constants/             # App constants
└── tailwind.config.js     # Theme configuration
```

## 🎨 Design System

The app uses a clean, minimalist design inspired by Hinge:

- **Colors**: White background with gray accents
- **Typography**: NunitoSans font family
- **Tab Bar**: Floating pill-style navigation with custom icons
- **Animations**: Spring-based micro-interactions

## 🚀 Roadmap

- [ ] Profile creation flow
- [ ] Swipeable profile cards
- [ ] Like/Pass functionality
- [ ] Real-time chat
- [ ] Push notifications
- [ ] Backend integration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Made with 💜 by Subh**
