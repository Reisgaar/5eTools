# Data Improvements for D&D 5e Tools App

## Overview
This document outlines the improvements made to the app's data handling system, moving from HTTP requests to local data storage and enhancing the tag replacement system.

## 🚀 Improvements Made

### 1. **Local Data Structure**
- **Created**: `src/data/local/` directory for storing JSON data files
- **Added**: Local data index system (`src/data/local/index.ts`)
- **Copied**: Key data files from 5etools source:
  - `bestiary-mm.json` (Monster Manual)
  - `bestiary-phb.json` (Player Handbook monsters)
  - `spells-phb.json` (Player Handbook spells)
  - `spells-xge.json` (Xanathar's Guide spells)

### 2. **Enhanced Data Loading System**
- **Created**: `src/data/localDataLoader.ts` for efficient local data loading
- **Features**:
  - Caching system for better performance
  - Source-based data loading
  - Index creation for fast searching
  - Error handling and fallbacks

### 3. **Improved Tag Replacement System**
- **Created**: `src/utils/enhancedTagReplacer.tsx`
- **Enhanced Features**:
  - More comprehensive tag support
  - Better styling and formatting
  - Interactive elements (clickable damage, saves, etc.)
  - Support for complex entry structures
  - Improved table rendering

## 📁 File Structure

```
src/
├── data/
│   ├── local/
│   │   ├── index.ts                    # Data source mappings
│   │   ├── bestiary-mm.json           # Monster Manual data
│   │   ├── bestiary-phb.json          # PHB monster data
│   │   ├── spells-phb.json            # PHB spell data
│   │   └── spells-xge.json            # XGE spell data
│   ├── localDataLoader.ts             # Local data loading utilities
│   └── testLocalData.ts               # Testing utilities
└── utils/
    └── enhancedTagReplacer.tsx        # Enhanced tag replacement system
```

## 🔧 Key Features

### **Local Data Index System**
```typescript
// Maps source codes to file names
export const BESTIARY_INDEX = {
    "MM": "bestiary-mm.json",
    "PHB": "bestiary-phb.json",
    // ... more sources
};

export const SPELLS_INDEX = {
    "PHB": "spells-phb.json",
    "XGE": "spells-xge.json",
    // ... more sources
};
```

### **Enhanced Tag Support**
The new tag replacement system supports:
- **Combat**: `{@atk}`, `{@hit}`, `{@damage}`, `{@dc}`, `{@save}`
- **Links**: `{@creature}`, `{@spell}`, `{@item}`, `{@feat}`
- **Conditions**: `{@condition}`, `{@status}`
- **Formatting**: `{@b}`, `{@i}`, `{@recharge}`
- **Skills**: `{@skill}`, `{@skillCheck}`

### **Interactive Elements**
- **Clickable damage dice**: Roll damage expressions
- **Clickable hit bonuses**: Calculate attack rolls
- **Clickable saves**: Calculate saving throws
- **Clickable links**: Navigate to creatures, spells, items
- **Clickable conditions**: View condition details

## 🎯 Benefits

### **Performance Improvements**
- ✅ **Faster loading**: No HTTP requests needed
- ✅ **Offline support**: Works without internet
- ✅ **Caching**: Data cached in memory for instant access
- ✅ **Reduced bandwidth**: No data transfer costs

### **Reliability Improvements**
- ✅ **No network dependency**: Works offline
- ✅ **No rate limiting**: No API restrictions
- ✅ **Consistent data**: Always the same data version
- ✅ **Error handling**: Graceful fallbacks

### **User Experience Improvements**
- ✅ **Better formatting**: Enhanced text rendering
- ✅ **Interactive elements**: Clickable dice and links
- ✅ **Rich content**: Better support for complex data structures
- ✅ **Consistent styling**: Unified theme support

## 🧪 Testing

### **Test Local Data Loading**
```typescript
import { testLocalDataLoading, testDataStructure } from 'src/data/testLocalData';

// Test data loading
await testLocalDataLoading();

// Test data structure
testDataStructure();
```

### **Expected Output**
```
🧪 Testing local data loading...
📖 Loading Monster Manual data...
✅ Loaded 350+ monsters from MM
✨ Loading Player Handbook spell data...
✅ Loaded 300+ spells from PHB
📚 Loading Xanathar's Guide spell data...
✅ Loaded 100+ spells from XGE
✅ Local data loading test completed successfully!
```

## 🔄 Migration Path

### **Phase 1: Testing (Current)**
- [x] Set up local data structure
- [x] Create enhanced tag replacement system
- [x] Test with sample data files
- [ ] Verify app functionality

### **Phase 2: Integration**
- [ ] Update DataContext to use local data
- [ ] Replace HTTP requests with local loading
- [ ] Update components to use enhanced tags
- [ ] Test all features

### **Phase 3: Expansion**
- [ ] Add more data files (items, feats, etc.)
- [ ] Implement advanced filtering
- [ ] Add search functionality
- [ ] Optimize performance

## 📊 Data Sources Available

### **Bestiary (Monsters)**
- **MM**: Monster Manual (350+ monsters)
- **PHB**: Player Handbook monsters
- **VGM**: Volo's Guide to Monsters
- **MTF**: Mordenkainen's Tome of Foes
- **MPMM**: Mordenkainen Presents: Monsters of the Multiverse
- **And many more...**

### **Spells**
- **PHB**: Player Handbook (300+ spells)
- **XGE**: Xanathar's Guide to Everything (100+ spells)
- **TCE**: Tasha's Cauldron of Everything
- **And many more...**

## 🎨 Enhanced Tag Examples

### **Combat Tags**
```json
{
  "text": "{@atk mw} {@hit 5} to hit, reach 5 ft., one target. {@h}6 ({@damage 1d6 + 3}) piercing damage."
}
```

### **Creature Links**
```json
{
  "text": "The {@creature dragon|MM} breathes fire."
}
```

### **Spell Links**
```json
{
  "text": "Casts {@spell fireball|PHB} at 3rd level."
}
```

### **Complex Entries**
```json
{
  "type": "entries",
  "name": "Multiattack",
  "entries": [
    "The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws."
  ]
}
```

## 🚀 Next Steps

1. **Test the current implementation** with the sample data
2. **Integrate into DataContext** to replace HTTP requests
3. **Add more data files** for comprehensive coverage
4. **Implement advanced features** like search and filtering
5. **Optimize performance** for large datasets

## 📝 Notes

- **Data Source**: All data comes from the official 5etools project
- **License**: Respects 5etools licensing and attribution
- **Updates**: Can be updated by copying new data files
- **Compatibility**: Maintains compatibility with existing app structure
