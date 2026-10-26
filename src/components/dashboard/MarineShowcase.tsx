import React, { useState } from 'react';
import {
  Waves,
  Fish,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info,
  Sparkles,
  Droplets,
  Heart
} from 'lucide-react';

interface MarineItem {
  id: string;
  commonName: string;
  scientificName: string;
  category: string;
  statusBadge: string;
  statusColor: string;
  imageUrl: string;
  altText: string;
  location: string;
  story: string;
  waterConnection: string;
  actionTip: string;
}

const MARINE_ITEMS: MarineItem[] = [
  {
    id: 'coral-reefs',
    commonName: 'Pristine Coral Reefs',
    scientificName: 'Anthozoa / Scleractinia (Apo Reef & Tubbataha)',
    category: 'Vibrant Marine Ecosystem',
    statusBadge: 'UNESCO Heritage Sanctuary',
    statusColor: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-500/30',
    imageUrl: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80',
    altText: 'Vibrant living tropical coral reef with clownfish and sea anemones underwater',
    location: 'Sulu Sea & Mindoro Strait, Philippines',
    story: 'The Coral Triangle harbors over 76% of the world’s shallow coral species. Corals are living colonial organisms that build limestone castles sheltering thousands of fish species.',
    waterConnection: 'Excessive domestic water consumption overloads sewage networks. Raw wastewater and laundry phosphates cause rapid eutrophication and algal blooms that block sunlight and suffocate coral reefs.',
    actionTip: 'Switching to eco-friendly phosphate-free soaps and fixing household leaks directly reduces chemical runoff into coastal reefs.'
  },
  {
    id: 'sea-turtle',
    commonName: 'Hawksbill & Green Sea Turtles (Pawikan)',
    scientificName: 'Eretmochelys imbricata / Chelonia mydas',
    category: 'Endangered Marine Reptile',
    statusBadge: 'Critically Endangered',
    statusColor: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-500/30',
    imageUrl: 'https://images.unsplash.com/photo-1518467166778-b88f373ffec7?auto=format&fit=crop&w=800&q=80',
    altText: 'Endangered Hawksbill sea turtle gliding gracefully through sunlit turquoise ocean waters',
    location: 'Morong, Bataan & Turtle Islands, Tawi-Tawi',
    story: 'Sea turtles have patrolled Philippine waters for over 100 million years. They graze on seagrass beds and jellyfish, maintaining healthy ecosystems vital for coastal fisheries.',
    waterConnection: 'Domestic runoff carrying single-use plastics and chemical solvents from sinks and storm drains contaminates coastal foraging grounds, choking marine life and poisoning nesting beaches.',
    actionTip: 'Ensure household grease and plastic trash never enter domestic drains or gutters under Philippine RA 9003 and RA 9275.'
  },
  {
    id: 'spinner-dolphin',
    commonName: 'Philippine Spinner & Irrawaddy Dolphins',
    scientificName: 'Stenella longirostris / Orcaella brevirostris',
    category: 'Oceanic Cetacean',
    statusBadge: 'Strictly Protected',
    statusColor: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-500/30',
    imageUrl: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80',
    altText: 'Playful oceanic dolphins leaping harmoniously in crystal clear azure ocean waters',
    location: 'Tañon Strait & Malampaya Sound, Palawan',
    story: 'Known for their acrobatic aerial spins, spinner dolphins hunt small lanternfish and squid in deep offshore trenches by night and rest in protected coastal bays by day.',
    waterConnection: 'Healthy coastal dolphin nurseries depend on clean freshwater inflows from river basins that provide natural salinity gradients and sustain plankton blooms without toxic industrial sediment.',
    actionTip: 'Conserving freshwater prevents upstream river salinization and maintains the natural balance of estuarine dolphin nurseries.'
  },
  {
    id: 'whale-shark',
    commonName: 'The Gentle Giant: Whale Shark (Butanding)',
    scientificName: 'Rhincodon typus',
    category: 'Pelagic Filter Feeder',
    statusBadge: 'Vulnerable Wildlife',
    statusColor: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-500/30',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    altText: 'Magnificent spotted whale shark filter-feeding peacefully in tropical azure waters',
    location: 'Donsol, Sorsogon & Tubbataha Reefs Natural Park',
    story: 'The world’s largest fish grows up to 18 meters long yet feeds harmlessly on microscopic krill and plankton, migrating thousands of kilometers across the Philippine archipelago.',
    waterConnection: 'Because whale sharks filter thousands of cubic meters of ocean water every single hour, microplastics and chemical residues washed out through river channels directly enter their digestive systems.',
    actionTip: 'Every liter of water saved and properly disposed of reduces urban sediment and microplastic loading into coastal feeding corridors.'
  }
];

export const MarineShowcase: React.FC<{ onNavigateToLearn: () => void }> = ({ onNavigateToLearn }) => {
  const [selectedItem, setSelectedItem] = useState<MarineItem | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleImgError = (id: string) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section className="space-y-6">
      {/* Header with mission statement */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
              <Waves className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Marine Ecosystems & Wildlife
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
            From Your Tap to the Living Ocean
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1">
            Every drop of freshwater conserved upstream helps protect vibrant coral reefs, sea turtles, dolphins, and endangered aquatic life in Philippine seas.
          </p>
        </div>

        <button
          onClick={onNavigateToLearn}
          className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center gap-1 shrink-0"
        >
          <span>Explore Marine Lessons</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4 Interactive Wildlife & Ecosystem Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MARINE_ITEMS.map((item) => {
          const hasError = imgErrors[item.id];

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer rounded-3xl bg-white dark:bg-[#102338] border border-slate-200 dark:border-[#263D52] shadow-sm hover:shadow-xl hover:border-cyan-500/50 transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Fallback */}
                <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                  {!hasError ? (
                    <img
                      src={item.imageUrl}
                      alt={item.altText}
                      loading="lazy"
                      onError={() => handleImgError(item.id)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-tr from-blue-900 via-cyan-900 to-teal-900 text-white text-center">
                      <Fish className="w-10 h-10 text-cyan-400 mb-2 animate-bounce" />
                      <span className="text-xs font-bold tracking-wide">{item.commonName}</span>
                      <span className="text-[10px] text-cyan-200/80 italic mt-0.5">{item.location}</span>
                    </div>
                  )}

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Badges on image */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-sm ${item.statusColor}`}>
                      {item.statusBadge}
                    </span>
                  </div>

                  {/* Location Pin */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-cyan-300 truncate">
                      {item.location}
                    </p>
                    <h4 className="font-bold text-sm text-white truncate drop-shadow-sm">
                      {item.commonName}
                    </h4>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-2">
                  <p className="text-[11px] font-mono italic text-slate-500 dark:text-slate-400 truncate">
                    {item.scientificName}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {item.story}
                  </p>
                </div>
              </div>

              {/* Water Link Highlight */}
              <div className="p-4 pt-0">
                <div className="p-2.5 rounded-2xl bg-cyan-50/60 dark:bg-cyan-950/40 border border-cyan-500/20 text-[11px] text-cyan-900 dark:text-cyan-200">
                  <div className="flex items-center gap-1 font-bold mb-0.5 text-cyan-700 dark:text-cyan-400">
                    <Droplets className="w-3 h-3" />
                    <span>How Saving Water Helps:</span>
                  </div>
                  <p className="line-clamp-2 text-[10px] text-slate-600 dark:text-slate-300">
                    {item.actionTip}
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full mt-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1"
                >
                  <span>Read Full Impact Story</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upstream to Downstream Watershed Infographic Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-cyan-900 to-[#0A2540] text-white border border-cyan-500/30 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Watershed Stewardship Principle
              </span>
            </div>
            <h4 className="text-base sm:text-lg font-bold">
              "We Don't Inherit the Oceans from Our Ancestors; We Borrow Them from Our Children."
            </h4>
            <p className="text-xs text-cyan-100/90 max-w-xl">
              1 Liter of untreated household water can contaminate up to 8 Liters of fresh river water, which directly drains into coastal reefs and seagrass pastures. Every conscious action at your sink echoes in our seas.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToLearn}
              className="px-5 py-2.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-900 font-bold text-xs shadow-md shadow-cyan-400/30 transition-all flex items-center gap-1.5"
            >
              <span>Learn Reef Conservation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Modal for Selected Marine Wildlife */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-[#102338] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative aspect-16/9 w-full bg-slate-900">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.altText}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${selectedItem.statusColor}`}>
                  {selectedItem.statusBadge}
                </span>
                <h3 className="text-lg font-bold mt-1 text-white">{selectedItem.commonName}</h3>
                <p className="text-xs font-mono italic text-cyan-200">{selectedItem.scientificName}</p>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                  Ecosystem Significance
                </h5>
                <p className="leading-relaxed">{selectedItem.story}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-500/20">
                <h5 className="font-bold text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5 mb-1 text-xs">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span>The Domestic Water Connection</span>
                </h5>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {selectedItem.waterConnection}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
                  What You Can Do Today
                </h5>
                <p className="leading-relaxed">{selectedItem.actionTip}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-xs shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
