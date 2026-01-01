/**
 * Japan 2026 - Tab navigation, scroll effects, and horizontal scroll cards with image carousels
 */
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initScrollEffects();
    renderAllCards();
    initDecks();
    initCarousels();
});

/* ========================================
   YEN TO USD CONVERSION
   ======================================== */
const YEN_TO_USD_RATE = 0.0067; // Approximate: 1 JPY = 0.0067 USD (roughly 150 JPY = 1 USD)

function convertYenToUSD(priceString) {
    if (!priceString) return null;

    // Check if it's "Free" or similar
    const lowerPrice = priceString.toLowerCase();
    if (lowerPrice === 'free' || lowerPrice.includes('free')) {
        return null;
    }

    // Extract yen amounts from the string
    // Match patterns like ¥500, ¥1,000, ¥15,000-25,000, etc.
    const yenMatches = priceString.match(/¥[\d,]+/g);
    if (!yenMatches || yenMatches.length === 0) return null;

    // Parse the yen values
    const yenValues = yenMatches.map(match => {
        const numStr = match.replace(/[¥,]/g, '');
        return parseInt(numStr, 10);
    }).filter(v => !isNaN(v));

    if (yenValues.length === 0) return null;

    // Convert to USD
    const usdValues = yenValues.map(yen => Math.round(yen * YEN_TO_USD_RATE));

    // Format the USD output
    if (usdValues.length === 1) {
        return `~$${usdValues[0]}`;
    } else if (usdValues.length === 2) {
        return `~$${usdValues[0]}-${usdValues[1]}`;
    } else {
        // For complex ranges, just show lowest and highest
        const min = Math.min(...usdValues);
        const max = Math.max(...usdValues);
        return `~$${min}-${max}`;
    }
}

function formatPriceWithUSD(priceString) {
    if (!priceString) return '';

    const usd = convertYenToUSD(priceString);
    if (usd) {
        return `${priceString}<span class="price-usd">${usd}</span>`;
    }
    return priceString;
}

/* ========================================
   CITY TAB NAVIGATION
   ======================================== */
function initTabs() {
    const tabs = document.querySelectorAll('.city-tab');
    const contents = document.querySelectorAll('.city-content');

    // Set default city theme on body (Tokyo is default active)
    document.body.classList.add('tokyo-active');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const city = tab.dataset.city;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update body class for city theming
            document.body.classList.remove('tokyo-active', 'kyoto-active', 'osaka-active');
            document.body.classList.add(`${city}-active`);

            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === city) {
                    content.classList.add('active');
                }
            });

            if (window.innerWidth <= 768) {
                document.querySelector('.content-area').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* ========================================
   SCROLL EFFECTS
   ======================================== */
function initScrollEffects() {
    const hero = document.querySelector('.hero');
    const nav = document.querySelector('.city-nav');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        if (hero) {
            const heroContent = hero.querySelector('.hero-content');
            const opacity = Math.max(0, 1 - scrolled / 400);
            heroContent.style.opacity = opacity;
        }

        if (nav) {
            if (scrolled > 100) {
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
            } else {
                nav.style.boxShadow = 'none';
            }
        }
    });
}

/* ========================================
   ACTIVITY DATA WITH MULTIPLE IMAGES
   ======================================== */

const activitiesData = {
    tokyo: {
        morning: [
            {
                name: "Meiji Jingu + Yoyogi Park",
                summary: "Built 1920 to honor Emperor Meiji—100,000 trees donated from across Japan",
                description: "You walk through a 12-meter cypress torii and suddenly 13 million people vanish. The 100,000 trees here were planted in 1920 by volunteers from across Japan. On weekends, Yoyogi Park's plaza fills with 1950s rockabilly dancers doing their thing to boomboxes—zero irony, full pompadours. Tradeoff: The shrine itself takes 20 minutes to reach from the entrance. Don't rush it.",
                price: "Free",
                url: "https://www.meijijingu.or.jp/en/",
                images: [
                    "https://images.unsplash.com/photo-1703443371292-0d9081cc4787?w=800",
                    "https://images.unsplash.com/photo-1720781910848-b0b76689fb8b?w=800"
                ],
                category: "Shrine",
                location: "Harajuku",
                coords: { lat: 35.6764, lng: 139.6993 },
                duration: "1-2 hours",
                tips: "Before 9am or you'll share it with tour buses"
            },
            {
                name: "Shinjuku Gyoen",
                summary: "Former Imperial garden since 1906—one of Tokyo's best-kept cherry blossom spots",
                description: "Japanese, English, and French gardens in one park—each section feels like a different country. Alcohol is banned, which keeps out the rowdy hanami parties. During cherry blossom season (late March–early April), 1,000+ trees bloom and it's one of the few places you can actually enjoy them without fighting for space. Tradeoff: Closes at 4:30pm in winter, 6pm in summer. No re-entry.",
                price: "¥500",
                url: "https://fng.or.jp/shinjuku/en/",
                images: [
                    "https://images.unsplash.com/photo-1603039066999-7b318f3a5dad?w=800",
                    "https://images.unsplash.com/photo-1607753882924-edf787e8e8d2?w=800",
                    "https://images.unsplash.com/photo-1572726320267-a3fffcddf105?w=800"
                ],
                category: "Park",
                location: "Shinjuku",
                coords: { lat: 35.6852, lng: 139.7100 },
                duration: "1-2 hours",
                tips: "Shinjuku Gyoenmae exit, not Shinjuku Station"
            },
            {
                name: "Edo-Tokyo Museum",
                summary: "1:1 replica of 1603 Nihonbashi bridge—Tokyo's history in full scale [CLOSED]",
                description: "Life-size reconstructions of Edo-period buildings you can enter. Scale models of Tokyo before firebombing flattened it. The Nihonbashi bridge replica spans the main hall—you cross it like merchants did 400 years ago. Explains why Tokyo's neighborhoods are the way they are. Tradeoff: CURRENTLY CLOSED FOR RENOVATION until 2028. Check before going.",
                price: "¥600",
                url: "https://www.edo-tokyo-museum.or.jp/en/",
                images: [
                    "https://images.unsplash.com/photo-1615790469537-7c9d8e95c047?w=800",
                    "https://images.unsplash.com/photo-1615790469465-2f1e2770280a?w=800",
                    "https://images.unsplash.com/photo-1719947691591-1e53670a6bf5?w=800"
                ],
                category: "Museum",
                location: "Ryogoku",
                coords: { lat: 35.6963, lng: 139.7963 },
                duration: "2-3 hours",
                tips: "CLOSED until 2028 for renovation"
            },
            {
                name: "Tokyo National Museum",
                summary: "Japan's oldest museum (1872)—samurai swords and 10,000-year-old pottery",
                description: "Japan's oldest museum (1872) with samurai swords, Jomon pottery from 10,000 BCE, and rotating National Treasures. The Honkan building alone has 25 rooms. Go straight to Gallery 5 for samurai armor and Gallery 10 for swords if time is short. Tradeoff: Exhausting if you try to see everything. Pick two buildings max.",
                price: "¥1,000",
                url: "https://www.tnm.jp/?lang=en",
                images: [
                    "https://images.unsplash.com/photo-1677774398078-dfebffbfcd54?w=800",
                    "https://images.unsplash.com/photo-1541689507962-7658adb8aa70?w=800",
                    "https://images.unsplash.com/photo-1677774396192-66dc8824719e?w=800"
                ],
                category: "Museum",
                location: "Ueno",
                coords: { lat: 35.7189, lng: 139.7766 },
                duration: "2-4 hours",
                tips: "Friday/Saturday open until 9pm"
            }
        ],
        daytime: [
            {
                name: "Senso-ji Temple",
                summary: "Founded 628 AD—Tokyo's oldest temple, 1,400 years before the city existed",
                description: "The Kaminarimon gate's 700kg lantern is the shot everyone gets, but the real move is walking Nakamise-dori at 6am when it's just you and the shop owners setting up. The incense burner in front—waft the smoke on whatever body part needs healing. Tradeoff: By 10am it's a human traffic jam. Either commit to early or accept you're here for the crowd energy.",
                price: "Free",
                url: "https://www.senso-ji.jp/english/",
                images: [
                    "https://images.unsplash.com/photo-1748878665884-00afa881e960?w=800",
                    "https://images.unsplash.com/photo-1580167227251-be70f01b0c51?w=800"
                ],
                category: "Temple",
                location: "Asakusa",
                coords: { lat: 35.7148, lng: 139.7967 },
                duration: "1-2 hours",
                tips: "6am for empty photos, or embrace the chaos"
            },
            {
                name: "TeamLab Borderless",
                summary: "World's most-visited single-artist museum—2.3M people/year",
                description: "No map, no set path—you wander through 60+ installations that bleed into each other. Flowers bloom at your feet and scatter when you step. The Infinity Mirror room puts you inside a kaleidoscope. Wear white to become a canvas. Tradeoff: Tickets sell out 2-3 weeks ahead. New Azabudai Hills location opened 2024—bigger, but same demand.",
                price: "¥3,800",
                url: "https://www.teamlab.art/e/borderless-azabudai/",
                images: [
                    "https://images.unsplash.com/photo-1584202257553-4c07e497b675?w=800",
                    "https://images.unsplash.com/photo-1592997264946-028edf8ea505?w=800",
                    "https://images.unsplash.com/photo-1593073862407-a3ce22748763?w=800"
                ],
                category: "Art",
                location: "Azabudai Hills",
                coords: { lat: 35.6614, lng: 139.7412 },
                duration: "2-3 hours",
                tips: "Book 2+ weeks ahead, wear white clothes"
            },
            {
                name: "Shibuya Sky",
                summary: "Watch the world's busiest crossing—3,000 people every 90 seconds",
                description: "The Shibuya Crossing from above—watch the scramble reset every 90 seconds. The outdoor Sky Stage has no glass between you and the view. On clear days, Fuji floats on the horizon. Sunset slot books fast. Tradeoff: ¥2,200 for what's essentially 45 minutes of looking. Worth it once.",
                price: "¥2,200",
                url: "https://www.shibuya-sky.tokyo/en/",
                images: [
                    "https://images.unsplash.com/photo-1622989428689-569c4fe81c11?w=800",
                    "https://images.unsplash.com/photo-1697441574662-8d54b3a9a839?w=800",
                    "https://images.unsplash.com/photo-1729707397413-d4b10d6a0376?w=800"
                ],
                category: "Views",
                location: "Shibuya",
                coords: { lat: 35.6580, lng: 139.7016 },
                duration: "1 hour",
                tips: "Book sunset slot online, outdoor deck closes in rain"
            },
            {
                name: "Tsukiji Outer Market",
                summary: "Bourdain's favorite Tokyo food run—where the fish market chefs still eat",
                description: "Graze your way through: tamago (sweet omelet) on a stick at Yamacho, tuna cheek at Kitsuneya, strawberry daifuku anywhere. Go before 10am when restaurants start buying out the good stuff. The inner market moved to Toyosu in 2018—this outer ring is what remains. Tradeoff: Gets mobbed by tour groups after 11am. Also, it's cash-heavy.",
                price: "¥2,000-4,000 for a full graze",
                url: "https://www.tsukiji.or.jp/english/",
                images: [
                    "https://images.unsplash.com/photo-1490974764272-9f2b89eb0a6c?w=800",
                    "https://images.unsplash.com/photo-1541350013829-75d00d6c8578?w=800",
                    "https://images.unsplash.com/photo-1582538955726-8a88710bc514?w=800"
                ],
                category: "Food",
                location: "Tsukiji",
                coords: { lat: 35.6654, lng: 139.7707 },
                duration: "2-3 hours",
                tips: "Before 10am, bring cash"
            },
            {
                name: "Akihabara",
                summary: "World capital of anime and gaming—every major franchise started here",
                description: "Super Potato has retro games from Famicom to Dreamcast. Yodobashi Camera is 8 floors of electronics. Maid cafes exist if you want that experience (spoiler: it's weird and kind of boring). The arcades are the real draw—rhythm games, crane games, fighting games with regulars who will destroy you. Tradeoff: Skip entirely if anime/games aren't your thing. This neighborhood is one-note on purpose.",
                price: "Free to walk, ¥¥¥ if you shop",
                url: "https://www.google.com/maps/place/Akihabara",
                images: [
                    "https://images.unsplash.com/photo-1613487957484-32c977a8bd62?w=800",
                    "https://images.unsplash.com/photo-1580094573009-7a220cc896b2?w=800",
                    "https://images.unsplash.com/photo-1561172317-5427a31ef91e?w=800"
                ],
                category: "District",
                location: "Akihabara",
                coords: { lat: 35.6984, lng: 139.7731 },
                duration: "2-4 hours",
                tips: "Super Potato for retro games, skip maid cafes"
            },
            {
                name: "Harajuku → Omotesando",
                summary: "Gwen Stefani wrote 4 songs about this street—Tokyo's youth fashion ground zero",
                description: "Takeshita Street is narrow, loud, and packed with crepe shops and costume stores—peak teenage Tokyo. Walk 10 minutes and you hit Omotesando: Tadao Ando's concrete bunker for Armani, Herzog & de Meuron's Prada crystal, Kengo Kuma's Starbucks wrapped in wood beams. Two Tokyos in one walk. Tradeoff: Takeshita is genuinely suffocating on weekends.",
                price: "Free",
                url: "https://www.google.com/maps/place/Harajuku",
                images: [
                    "https://images.unsplash.com/photo-1667873584119-6a9d4376f42d?w=800",
                    "https://images.unsplash.com/photo-1593369855376-d1b385bcbcb0?w=800",
                    "https://images.unsplash.com/photo-1664806462678-5df01513f7b9?w=800"
                ],
                category: "Shopping",
                location: "Harajuku",
                coords: { lat: 35.6702, lng: 139.7026 },
                duration: "2-3 hours",
                tips: "Omotesando Hills mall has good architecture"
            },
            {
                name: "Ameyoko Market",
                summary: "Post-WWII black market still running 80 years later—cash and chaos only",
                description: "Runs along the Yamanote Line tracks—cramped, loud, vendors yelling '1000 yen!' at you. Fresh seafood, dried goods, cheap clothes, mystery bags of candy. It's post-war Tokyo energy preserved in amber. The kebabs are mediocre but the atmosphere isn't. Tradeoff: Zero English, cash only, aggressive sellers. That's the point.",
                price: "Free",
                url: "https://www.google.com/maps/place/Ameyoko",
                images: [
                    "https://images.unsplash.com/photo-1759849908485-2d9aaa84b7fc?w=800",
                    "https://images.unsplash.com/photo-1708834926884-757c9bdfc68b?w=800"
                ],
                category: "Market",
                location: "Ueno",
                coords: { lat: 35.7105, lng: 139.7747 },
                duration: "1-2 hours",
                tips: "Cash only, haggling expected"
            },
            {
                name: "Yanaka",
                summary: "Survived WWII firebombing—the last Shogun is buried here",
                description: "Narrow lanes, wooden houses, temple graveyards, cats everywhere. Yanaka Ginza shopping street does one thing: let you snack your way down 170 meters of menchi-katsu, croquettes, and taiyaki. The cemetery has the last Shogun's grave. Tradeoff: Not much happens here. That's the appeal. If you need stimulation, go elsewhere.",
                price: "Free",
                url: "https://www.google.com/maps/place/Yanaka+Ginza",
                images: [
                    "https://images.unsplash.com/photo-1740837705265-d9ffc4847738?w=800",
                    "https://images.unsplash.com/photo-1682949387331-8835ffaacd70?w=800"
                ],
                category: "Neighborhood",
                location: "Yanaka",
                coords: { lat: 35.7270, lng: 139.7670 },
                duration: "2-3 hours",
                tips: "Pair with Ueno, 15 min walk north"
            },
            {
                name: "Kichijoji",
                summary: "Voted #1 'where Tokyoites want to live' for a decade straight",
                description: "Inokashira Park has the swan boats where couples go to break up (it's a curse, apparently). Harmonica Yokocho is 97 narrow alley bars and restaurants from post-war black markets. Ranked #1 'where Tokyoites want to live' for years. Tradeoff: 20 minutes from central Tokyo. Worth it if you want to feel like a resident, not a tourist.",
                price: "Free",
                url: "https://www.google.com/maps/place/Kichijoji",
                images: [
                    "https://images.unsplash.com/photo-1566288180865-dc4f42265bb6?w=800",
                    "https://images.unsplash.com/photo-1500805987811-1913fdec59e6?w=800",
                    "https://images.unsplash.com/photo-1593343670872-5c954210a159?w=800"
                ],
                category: "Neighborhood",
                location: "Kichijoji",
                coords: { lat: 35.7035, lng: 139.5796 },
                duration: "Half day",
                tips: "Harmonica Yokocho for evening drinks"
            },
            {
                name: "Shimokitazawa",
                summary: "Tokyo's indie music birthplace—where Japanese punk and shoegaze started",
                description: "Tight streets with 100+ secondhand clothing shops, live music venues (Shelter, Basement Bar), and curry joints. Musicians, students, and artists. The vibe is Williamsburg-meets-Haight without the tech money. Tradeoff: Most vintage shops are overpriced for what they are. The record stores and live houses are the real draw.",
                price: "Free",
                url: "https://www.google.com/maps/place/Shimokitazawa",
                images: [
                    "https://images.unsplash.com/photo-1626666756883-a1c9de6fab60?w=800",
                    "https://images.unsplash.com/photo-1668562810574-0ff271257517?w=800",
                    "https://images.unsplash.com/photo-1622578363338-cebd410dad11?w=800"
                ],
                category: "Neighborhood",
                location: "Shimokitazawa",
                coords: { lat: 35.6617, lng: 139.6684 },
                duration: "Half day",
                tips: "Check live house schedules in advance"
            },
            {
                name: "Nakameguro",
                summary: "Where Blue Bottle opened its first Japan location—Tokyo's coffee capital",
                description: "During sakura season, the Meguro River is a tunnel of pink. Off-season, it's still Tokyo's cafe/boutique capital. Blue Bottle's original Japan location is here. Onibus Coffee. Traveler's Factory. Very walkable, very curated, zero tourist infrastructure. Tradeoff: In cherry blossom season, it's actually impassable. Like, you cannot physically move.",
                price: "Free",
                url: "https://www.google.com/maps/place/Nakameguro",
                images: [
                    "https://images.unsplash.com/photo-1621211877339-2fed302d4b9c?w=800",
                    "https://images.unsplash.com/photo-1522059462-7cb6905358c3?w=800",
                    "https://images.unsplash.com/photo-1564608910054-9c70f9d249ec?w=800"
                ],
                category: "Neighborhood",
                location: "Nakameguro",
                coords: { lat: 35.6440, lng: 139.6992 },
                duration: "2-3 hours",
                tips: "Skip during peak sakura unless you like crowds"
            },
            {
                name: "Kappabashi Street",
                summary: "World's largest kitchen supply district—800m of knife shops and fake food",
                description: "800-meter strip of professional kitchen supply shops. Japanese knives here are cheaper than tourist areas and the selection is vast (¥5,000-50,000+). The plastic food (sampuru) shops will custom-make you a sushi keychain. Tradeoff: Most shops close by 5pm and on Sundays. Staff speak limited English.",
                price: "Free to browse",
                url: "https://www.kappabashi.or.jp/en/",
                images: [
                    "https://images.unsplash.com/photo-1672927964531-1eb96f288816?w=800",
                    "https://images.unsplash.com/photo-1705470453458-b7e4465619a3?w=800",
                    "https://images.unsplash.com/photo-1746555702687-94fb068225b8?w=800"
                ],
                category: "Shopping",
                location: "Asakusa area",
                coords: { lat: 35.7138, lng: 139.7884 },
                duration: "1-2 hours",
                tips: "Combine with Senso-ji, closes 5pm"
            },
            {
                name: "Tokyo Metropolitan Government Building",
                summary: "Tange Kenzo's 1991 brutalist masterpiece—free 202m observation deck",
                description: "Tange Kenzo's brutalist twin towers have free observatories. North tower has a bar. South tower has slightly better Mt. Fuji sightlines. No reservation needed—just show up. Tradeoff: Lines can hit 30-45 minutes at sunset. Lower than Shibuya Sky (202m vs 229m) but you can't argue with free.",
                price: "Free",
                url: "https://www.yokoso.metro.tokyo.lg.jp/en/",
                images: [
                    "https://images.unsplash.com/photo-1564837532205-cc7b0900fcf3?w=800",
                    "https://images.unsplash.com/photo-1705699147926-05813429312a?w=800",
                    "https://images.unsplash.com/photo-1703945037550-497d4a5ce576?w=800"
                ],
                category: "Views",
                location: "Shinjuku",
                coords: { lat: 35.6896, lng: 139.6917 },
                duration: "30-60 min",
                tips: "North tower for bar, South for Fuji"
            }
        ],
        evening: [
            {
                name: "Golden Gai",
                summary: "Post-1945 black market bars—Tarantino and Coppola drink here",
                description: "Post-war black market turned drinking labyrinth. Each bar has a theme: horror movies, 60s rock, photography, obscure jazz. Some are tourists-welcome, some will wave you away—look for English menus in the window. Drinks run ¥700-1,200. Cover charges (¥500-1,500) are standard. Tradeoff: The popular ones have lines now. The good ones are the weird ones nobody's heard of.",
                price: "¥1,500-3,000/bar",
                url: "https://www.google.com/maps/place/Golden+Gai",
                images: [
                    "https://images.unsplash.com/photo-1676763118176-3ff8ffa7ddd4?w=800",
                    "https://images.unsplash.com/photo-1654350424788-08d651dbe094?w=800",
                    "https://images.unsplash.com/photo-1653062359845-717d7fabaf3e?w=800"
                ],
                category: "Nightlife",
                location: "Shinjuku",
                coords: { lat: 35.6943, lng: 139.7036 },
                duration: "2-4 hours",
                tips: "Bar hop 2-3 spots, check for English menus"
            },
            {
                name: "Omoide Yokocho (Piss Alley)",
                summary: "Yakitori alley since 1946—featured in The Fast and the Furious: Tokyo Drift",
                description: "The name comes from when there were no bathrooms and people... you get it. Now it's 60+ yakitori joints in alleys so narrow your shoulders touch both walls. Order negima (chicken and scallion), tebasaki (wings), kawa (crispy skin). Point at what others are eating. Cash only. Tradeoff: Vegetarians will struggle. Also, you will smell like smoke.",
                price: "¥1,500-2,500",
                url: "https://www.google.com/maps/place/Omoide+Yokocho",
                images: [
                    "https://images.unsplash.com/photo-1675857197778-223b59de19fe?w=800",
                    "https://images.unsplash.com/photo-1617870314635-fc819547ec11?w=800",
                    "https://images.unsplash.com/photo-1585988675248-4c75ca55cd26?w=800"
                ],
                category: "Food & Drink",
                location: "Shinjuku",
                coords: { lat: 35.6929, lng: 139.6982 },
                duration: "1-2 hours",
                tips: "Cash only, just point at what looks good"
            },
            {
                name: "Nonbei Yokocho",
                summary: "Shibuya's 1950s bar alley—40 spots the tourists haven't found yet",
                description: "Tucked behind the Shibuya train tracks. Same vibe as Golden Gai but smaller, older, and the tourists haven't fully discovered it. Mostly regulars and salarymen. Some bars don't even have signs. Tradeoff: Harder to find English, more intimidating to enter. Wave and point—it usually works.",
                price: "¥1,500-3,000",
                url: "https://www.google.com/maps/place/Nonbei+Yokocho",
                images: [
                    "https://images.unsplash.com/photo-1721736018999-f6285dc514c3?w=800",
                    "https://images.unsplash.com/photo-1570669231087-ddd48f16b775?w=800",
                    "https://images.unsplash.com/photo-1630615088688-9d62f18a41fc?w=800"
                ],
                category: "Nightlife",
                location: "Shibuya",
                coords: { lat: 35.6593, lng: 139.7027 },
                duration: "2+ hours",
                tips: "Behind Shibuya Station, look for the narrow entrance"
            },
            {
                name: "Karaoke",
                summary: "Where Bill Murray sang 'More Than This'—private rooms, unlimited drinks",
                description: "This isn't American karaoke—you get a private room with friends, a phone-book-sized song catalog, and tambourines. Big Echo and Karaoke Kan are reliable chains. Order the nomihodai (all-you-can-drink, ~¥1,500/2hrs). The Lost in Translation bar scene was filmed at Karaoke Kan Shibuya. Tradeoff: Sober karaoke is awkward. Drunk karaoke is mandatory.",
                price: "¥500-1,500/hour + drinks",
                url: "https://www.google.com/maps/search/Karaoke+Tokyo",
                images: [
                    "https://images.unsplash.com/photo-1708000873003-0d1a0f3ae051?w=800",
                    "https://images.unsplash.com/photo-1680396380365-8c9c769833b7?w=800",
                    "https://images.unsplash.com/photo-1571304783868-98aea683fb89?w=800"
                ],
                category: "Entertainment",
                location: "Everywhere",
                duration: "1-3 hours",
                tips: "Get nomihodai, don't go sober"
            },
            {
                name: "Kabukicho",
                summary: "Japan's largest red-light district—Blade Runner's visual inspiration",
                description: "Shinjuku's neon-drenched entertainment district. Host and hostess clubs, pachinko parlors, late-night izakayas. The famous Godzilla head is here. Walk through for the sensory overload, but pick your drinking spots deliberately. Touts will approach you—'No thanks' works. Tradeoff: Gets seedy fast if you follow anyone offering 'deals.'",
                price: "Free to walk",
                url: "https://www.google.com/maps/place/Kabukicho",
                images: [
                    "https://images.unsplash.com/photo-1552258694-1d83c5b9d2b3?w=800",
                    "https://images.unsplash.com/photo-1558632328-465f59aff245?w=800",
                    "https://images.unsplash.com/photo-1522209959493-d8b44d545931?w=800"
                ],
                category: "District",
                location: "Shinjuku",
                coords: { lat: 35.6952, lng: 139.7028 },
                duration: "30-60 min walk",
                tips: "Walk through for photos, don't follow touts"
            },
            {
                name: "Ebisu Yokocho",
                summary: "Former seafood warehouse turned 20-stall izakaya hall—opens 5pm sharp",
                description: "Indoor food hall packed with counter-service izakayas. Order yakitori from one stall, sashimi from another, drinks from a third—eat standing or at communal tables. Local office workers pack this place by 7pm. Tradeoff: Gets loud and crowded fast. No reservations, just squeeze in.",
                price: "¥2,000-4,000",
                url: "https://www.google.com/maps/place/Ebisu+Yokocho",
                images: [
                    "https://images.unsplash.com/photo-1585225010499-e5d61026b932?w=800",
                    "https://images.unsplash.com/photo-1729559149720-2b6c5c200428?w=800",
                    "https://images.unsplash.com/photo-1585225659982-ecbb8b6b8f6a?w=800"
                ],
                category: "Food & Drink",
                location: "Ebisu",
                coords: { lat: 35.6467, lng: 139.7103 },
                duration: "1-2 hours",
                tips: "Go by 6pm or prepare to stand"
            },
            {
                name: "Shinbashi Under-the-Tracks",
                summary: "Salaryman drinking culture since 1945—¥300 beers, zero English",
                description: "The stretch of izakayas directly under the JR Shinbashi tracks is where exhausted office workers go at 6pm sharp. Cheap beer, cigarette smoke, loosened ties. You'll be the only foreigner. Point at food, say 'biiru' for beer. Tradeoff: Zero English, zero accommodations for visitors. That's the point.",
                price: "¥1,500-2,500",
                url: "https://www.google.com/maps/place/Shinbashi",
                images: [
                    "https://images.unsplash.com/photo-1682949386267-9cecd992fd20?w=800",
                    "https://images.unsplash.com/photo-1682949387165-5d991b36f4d7?w=800",
                    "https://images.unsplash.com/photo-1682949387412-14ee6fcf5f22?w=800"
                ],
                category: "Nightlife",
                location: "Shinbashi",
                coords: { lat: 35.6660, lng: 139.7583 },
                duration: "1-2 hours",
                tips: "Say 'biiru kudasai' for beer"
            },
            {
                name: "Late-Night Ramen",
                summary: "Japan's post-drinking ritual—Bourdain called it 'the finish line'",
                description: "Post-drinking ramen is non-negotiable. Ichiran's solo booths are perfect for drunk introspection—customize your order via paper slip. Fuunji near Shinjuku does rich tsukemen until 3am. Or just follow the steam from any random shop with a line. Tradeoff: The best ramen shops close by midnight. The late-night ones are more 'functional' than transcendent.",
                price: "¥900-1,400",
                url: "https://www.google.com/maps/search/ramen+Tokyo",
                images: [
                    "https://images.unsplash.com/photo-1659162035169-920e63cae982?w=800",
                    "https://images.unsplash.com/photo-1607210000889-8a40010f935a?w=800",
                    "https://images.unsplash.com/photo-1560640507-a9e7a39b38f0?w=800"
                ],
                category: "Late Night",
                location: "Everywhere",
                duration: "20-40 min",
                tips: "Ichiran for solo, any place with a line for adventure"
            }
        ],
        food: [
            {
                name: "Ichiran Ramen",
                summary: "Hakata-style tonkotsu since 1960—solo booths for maximum focus",
                description: "Order via vending machine, sit in a solo booth with wooden partitions, fill out a paper form (noodle firmness 1-5, broth richness, garlic level, spice). A bamboo blind lifts, your bowl appears, you never see who made it. It's engineered for focused eating. Tradeoff: This is a chain—reliable but not transcendent. Good for: introverts, first-timers, 2am alone.",
                price: "¥1,000-1,500",
                url: "https://www.google.com/maps/search/Ichiran+Ramen+Tokyo",
                images: [
                    "https://images.unsplash.com/photo-1591325418441-ff678baf78ef?w=800",
                    "https://images.unsplash.com/photo-1730276694888-9fc1df06003d?w=800",
                    "https://images.unsplash.com/photo-1734313218532-94c43b09044f?w=800"
                ],
                category: "Ramen",
                location: "Shibuya, Shinjuku, everywhere",
                duration: "20-30 min",
                tips: "Get extra noodles (kae-dama) for ¥210"
            },
            {
                name: "Fuunji",
                summary: "Ranked #1 tsukemen in Shinjuku—30-min line is the price of admission",
                description: "Dip cold noodles into concentrated fish-pork broth that coats like sauce. The line moves fast because everyone eats fast—this isn't leisurely dining. Get the large (¥100 more) because you will want more. Ask for 'soup wari' at the end—they dilute your remaining broth into drinkable soup. Tradeoff: Always a line. 30-45 min wait is standard.",
                price: "¥900-1,200",
                url: "https://www.google.com/maps/place/Fuunji",
                images: [
                    "https://images.unsplash.com/photo-1690251670795-8f74a1037c23?w=800",
                    "https://images.unsplash.com/photo-1667788000254-bc37a16dc88c?w=800"
                ],
                category: "Tsukemen",
                location: "Shinjuku",
                duration: "45-60 min total",
                tips: "Get large, ask for soup wari at end"
            },
            {
                name: "Gyukatsu Motomura",
                summary: "Started the gyukatsu craze in 2014—rare beef you sear tableside",
                description: "Breaded beef arrives medium-rare. You cook each bite to your preference on a 250°C stone at your table. Comes with three sauces: wasabi soy, rock salt, curry. The contrast of crispy breading and pink interior is the whole point. Tradeoff: Always a line (30-60 min). Multiple locations—Shibuya is most accessible.",
                price: "¥1,500-2,000",
                url: "https://www.google.com/maps/search/Gyukatsu+Motomura+Tokyo",
                images: [
                    "https://images.unsplash.com/photo-1667933159296-83286c17e8cf?w=800",
                    "https://images.unsplash.com/photo-1720792445167-c622bb1d8378?w=800"
                ],
                category: "Beef",
                location: "Shibuya, Shinjuku, Akihabara",
                duration: "45-60 min total",
                tips: "Try all three sauces, sear each bite differently"
            },
            {
                name: "Convenience Store Food",
                summary: "Bourdain ate 7-Eleven onigiri on camera—it's genuinely that good",
                description: "7-Eleven's salmon onigiri. Lawson's karaage-kun. FamilyMart's famichiki. The egg sandwiches (tamago sando) are fluffy miracles. This is not gas station food—it's genuinely good and available 24/7 for under ¥500. Tradeoff: None. This is unironically one of the best food experiences in Japan. Accept it.",
                price: "¥100-500",
                url: "https://www.google.com/maps/search/7-Eleven+Tokyo",
                images: [
                    "https://images.unsplash.com/photo-1737382671141-a47408535a92?w=800",
                    "https://images.unsplash.com/photo-1586680004110-0a5f785bd9d8?w=800",
                    "https://images.unsplash.com/photo-1708600140738-cc754b351c9c?w=800"
                ],
                category: "Konbini",
                location: "Literally everywhere",
                tips: "Onigiri + hot coffee = ¥300 breakfast"
            },
            {
                name: "Tempura Kondo",
                summary: "Michelin 2-star since 2008—25-minute sweet potato changed tempura forever",
                description: "Fumio Kondo's famous for his sweet potato tempura—two slow-fried for 25 minutes until the inside caramelizes. Counter seating only, watch each piece fried to order. The vegetables here are revelations. Tradeoff: ¥15,000+ for lunch. Reservations needed weeks ahead. This is special-occasion territory.",
                price: "¥15,000-25,000",
                url: "https://www.google.com/maps/place/Tempura+Kondo",
                images: [
                    "https://images.unsplash.com/photo-1666599207746-0868c6a556d2?w=800",
                    "https://images.unsplash.com/photo-1663870158409-2d3c78ba0a9f?w=800",
                    "https://images.unsplash.com/photo-1706839640651-738dd3f6f710?w=800"
                ],
                category: "Tempura",
                location: "Ginza",
                duration: "1.5-2 hours",
                tips: "Reserve far ahead, worth it once"
            },
            {
                name: "Tonkatsu Maisen",
                summary: "Operating from a 1920s bathhouse—Tokyo's tonkatsu benchmark since 1965",
                description: "Kurobuta (black pig) pork, breaded and fried until the outside shatters and the inside stays juicy. The Omotesando flagship is in a 1920s bathhouse—get the kurobuta hire (filet) or rosu (loin). Grind your own sesame, mix with tonkatsu sauce. Tradeoff: Tourist-known, but earned. Lunch lines can hit 30 min.",
                price: "¥1,800-2,500",
                url: "https://www.google.com/maps/place/Maisen+Aoyama",
                images: [
                    "https://images.unsplash.com/photo-1496112774951-bf41010eed5e?w=800",
                    "https://images.unsplash.com/photo-1734775373504-ff24ea8419b2?w=800",
                    "https://images.unsplash.com/photo-1625189657980-b419b768b0f6?w=800"
                ],
                category: "Tonkatsu",
                location: "Omotesando",
                duration: "45-60 min",
                tips: "Kurobuta hire for lean, rosu for fatty"
            },
            {
                name: "Monjayaki in Tsukishima",
                summary: "Tokyo's original since Meiji era—70+ shops on 'Monja Street'",
                description: "Tsukishima has 70+ monja restaurants on one street. You pour batter on a hot griddle, spread it thin, let it crisp on the bottom while staying gooey on top. Eat directly off the grill with tiny spatulas. It looks like a mess. It is. That's the point. Tradeoff: You will burn your mouth. Also, it's not photogenic.",
                price: "¥1,000-1,500 per monja",
                url: "https://www.google.com/maps/place/Tsukishima",
                images: [
                    "https://images.unsplash.com/photo-1678294236894-ca0a16e66636?w=800",
                    "https://images.unsplash.com/photo-1714313109548-3a07b15df77f?w=800",
                    "https://images.unsplash.com/photo-1631773870335-a1811956c99b?w=800"
                ],
                category: "Monjayaki",
                location: "Tsukishima",
                duration: "1 hour",
                tips: "Order 2-3 different flavors, share"
            },
            {
                name: "Unagi (Eel)",
                summary: "Obayashi opened 1863—same recipe for 160 years",
                description: "Unajyu: grilled eel over rice in a lacquered box. Obayashi in Nihonbashi has been doing this since 1863. The eel is steamed (Tokyo-style) so it's tender, then grilled with tare sauce until caramelized. Tradeoff: Not cheap (¥3,000+). Summer is peak season—Japanese eat unagi on the hottest day of summer (doyo no ushi no hi) for stamina.",
                price: "¥3,000-5,000",
                url: "https://www.google.com/maps/search/Unagi+Tokyo",
                images: [
                    "https://images.unsplash.com/photo-1649687040567-d8e8f83def28?w=800",
                    "https://images.unsplash.com/photo-1763627719044-5d1d6a6b809c?w=800",
                    "https://images.unsplash.com/photo-1740895362852-8ea88c9ab65d?w=800"
                ],
                category: "Unagi",
                location: "Various (Nihonbashi for old-school)",
                duration: "45-60 min",
                tips: "Tokyo-style is steamed then grilled"
            },
            {
                name: "Yakiniku (Japanese BBQ)",
                summary: "Yoroniku: Tokyo's hardest reservation—ranked Japan's best yakiniku",
                description: "Order cuts (kalbi, harami, tongue), grill them yourself, dip in tare or salt, repeat. Yoroniku in Minami-Aoyama is the high-end move (¥15,000+, reservations). Stamina-en in Shibuya is the 24-hour locals spot. Get the assorted platter, add beer, stay two hours. Tradeoff: Solo yakiniku is sad. Bring friends.",
                price: "¥4,000-15,000+ depending on grade",
                url: "https://www.google.com/maps/search/Yakiniku+Tokyo",
                images: [
                    "https://images.unsplash.com/photo-1663569820326-fece03afdf1c?w=800",
                    "https://images.unsplash.com/photo-1740895299299-fe11f57507dc?w=800",
                    "https://images.unsplash.com/photo-1494566942107-a6e23c42d69e?w=800"
                ],
                category: "BBQ",
                location: "Various",
                duration: "1.5-2 hours",
                tips: "Yoroniku for splurge, Stamina-en for 2am"
            },
            {
                name: "Yakitori Alley (Yurakucho)",
                summary: "Under-the-tracks yakitori since 1945—Jiro Dreams of Sushi director eats here",
                description: "Negima (thigh + scallion), tsukune (meatball), kawa (skin), nankotsu (cartilage), sunagimo (gizzard). Order by the stick, drink beer, repeat. Yurakucho under the train tracks has a whole strip of yakitori joints—smoke everywhere, plastic stools, perfect. Tradeoff: The adventurous cuts (heart, liver) aren't for everyone.",
                price: "¥2,000-3,500",
                url: "https://www.google.com/maps/place/Yurakucho",
                images: [
                    "https://images.unsplash.com/photo-1727281970324-4bda7bab3073?w=800",
                    "https://images.unsplash.com/photo-1727281970228-a5ae69599fd8?w=800",
                    "https://images.unsplash.com/photo-1727281970223-d4895fd0872f?w=800"
                ],
                category: "Yakitori",
                location: "Yurakucho, everywhere",
                duration: "1-2 hours",
                tips: "Yurakucho tracks for atmosphere"
            }
        ],
        drinks: [
            {
                name: "Popeye",
                summary: "Japan's craft beer pioneer since 1985—70+ taps, newspaper-sized menu",
                description: "Opened in 1985, this Ryogoku institution has more Japanese craft on tap than anywhere else. The menu is a newspaper. The food is designed to pair—try the lamb sausage. Near the sumo stadium, so go after a tournament. Tradeoff: It's far from central Tokyo (Ryogoku). Worth the trip if beer matters to you.",
                price: "¥700-1,000/beer",
                url: "https://beerclubpopeye.com/",
                images: [
                    "https://images.unsplash.com/photo-1763609787267-5cc32988967d?w=800",
                    "https://images.unsplash.com/photo-1760967001400-25e5cadee277?w=800",
                    "https://images.unsplash.com/photo-1596534634741-dce0ddebf838?w=800"
                ],
                category: "Craft Beer",
                location: "Ryogoku",
                coords: { lat: 35.6963, lng: 139.7963 },
                duration: "1-2 hours",
                tips: "Combine with sumo in Ryogoku"
            },
            {
                name: "Zoetrope",
                summary: "Discontinued Karuizawa and rare Ichiro's Malt—300+ bottles, 12 seats",
                description: "The owner has bottles you can't find anywhere—discontinued Karuizawas, limited Ichiro's Malt. No cocktails, just whisky poured neat or with water. Quiet conversation only. Seats 12 at the bar. Tradeoff: ¥1,500-10,000+ per pour depending on rarity. No food. This is for whisky people.",
                price: "¥1,500-10,000+/pour",
                url: "https://www.google.com/maps/place/Zoetrope",
                images: [
                    "https://images.unsplash.com/photo-1695053979993-aa3401ef5694?w=800",
                    "https://images.unsplash.com/photo-1541491263892-731bc0c6a2ae?w=800",
                    "https://images.unsplash.com/photo-1718881951099-759d473a3dd5?w=800"
                ],
                category: "Whiskey",
                location: "Shinjuku",
                coords: { lat: 35.6895, lng: 139.7007 },
                duration: "1-2 hours",
                tips: "Ask owner for recommendations, he knows everything"
            },
            {
                name: "Tachinomi (Standing Bars)",
                summary: "Post-work drinking culture since the Edo period—¥300 beers, no seats",
                description: "Stand-up bars near train stations where salarymen stop for one (or five) after work. Drinks are cheap (¥300-500), food is simple (edamame, fried things). No English menus. You order at the counter. Search Google Maps for 'tachinomi' in any neighborhood. Tradeoff: You're standing. For an hour. But the price and atmosphere can't be beat.",
                price: "¥300-500/drink",
                url: "https://www.google.com/maps/search/tachinomi+Tokyo",
                images: [
                    "https://images.unsplash.com/photo-1759301247382-9bac9fcf8ba6?w=800",
                    "https://images.unsplash.com/photo-1655348495218-5847b68b6a00?w=800"
                ],
                category: "Local",
                location: "Near any station",
                duration: "30-60 min",
                tips: "Point, smile, say 'biiru kudasai'"
            },
            {
                name: "Nomihodai (All-You-Can-Drink)",
                summary: "Standard Japanese office party format—unlimited drinks, 2-hour timer",
                description: "Most izakayas offer nomihodai—timed all-you-can-drink plans. Beer, highballs, shochu, basic cocktails. Groups book a table, order food separately, and the drinks keep coming for 2 hours. It's the standard Japanese work party format. Tradeoff: Quality is 'quantity over finesse.' But the value is real if you're committed.",
                price: "¥1,500-2,500 for 2 hours",
                url: "https://www.google.com/maps/search/Izakaya+Tokyo",
                images: [
                    "https://images.unsplash.com/photo-1754228652704-2679d0a1c0b5?w=800",
                    "https://images.unsplash.com/photo-1675002305563-9b562a005939?w=800",
                    "https://images.unsplash.com/photo-1608060313204-295e532517df?w=800"
                ],
                category: "Value",
                location: "Most izakayas",
                duration: "2 hours",
                tips: "Book for groups, order food too"
            },
            {
                name: "NPB Baseball Game",
                summary: "40,000 fans chanting in unison—Japan's answer to European football culture",
                description: "Each team has coordinated chants with trumpets, drums, and 40,000 people singing in unison. Beer vendors in miniskirts climb stadium stairs with kegs on their backs. Yakult Swallows at Jingu Stadium is the intimate pick. Giants at Tokyo Dome is the big show. Season runs March-October. Tradeoff: Tickets sell out for popular games. Book ahead.",
                price: "¥2,500-6,000",
                url: "https://www.google.com/maps/place/Tokyo+Dome",
                images: [
                    "https://images.unsplash.com/photo-1622424114500-24202766581f?w=800",
                    "https://images.unsplash.com/photo-1597473901815-3bcfb20a0037?w=800"
                ],
                category: "Experience",
                location: "Jingu (Swallows) or Tokyo Dome (Giants)",
                duration: "3-4 hours",
                tips: "Jingu is more fun, Tokyo Dome is bigger"
            }
        ],
        daytrips: [
            {
                name: "Hakone",
                summary: "Edo-era hot spring resort—where samurai recovered on the old Tokaido road",
                description: "Buy the Hakone Free Pass (¥6,100 from Shinjuku) for unlimited transport: train, cable car, ropeway, pirate ship cruise. Owakudani has sulfur vents and black eggs boiled in volcanic pools (adds 7 years to your life, apparently). Soak in an onsen. See Fuji if it's clear. Tradeoff: Weather-dependent. Fuji visibility is ~30% in summer. Overnight makes it less rushed.",
                price: "¥6,100 (Hakone Free Pass)",
                url: "https://www.hakonenavi.jp/international/en/",
                images: [
                    "https://images.unsplash.com/photo-1583901362846-13c55e045708?w=800",
                    "https://images.unsplash.com/photo-1601823947179-2d2397d68d5e?w=800",
                    "https://images.unsplash.com/photo-1749352133990-67bf2a652149?w=800"
                ],
                category: "Day Trip",
                location: "85 min from Shinjuku",
                duration: "Full day (overnight better)",
                tips: "Clear winter days for best Fuji views"
            },
            {
                name: "Kamakura",
                summary: "Japan's samurai capital 1185-1333—the Great Buddha since 1252",
                description: "The Great Buddha (Daibutsu) is 13 meters tall and you can go inside. Hase-dera temple overlooks the ocean. The Daibutsu hiking trail connects major sites through forest. Enoshima island nearby has a beach, caves, and seafood. Tradeoff: Temples get repetitive if you overdo it. Pick 2-3 max and leave time for the beach/town vibe.",
                price: "¥1,500 round-trip train",
                url: "https://www.google.com/maps/place/Kamakura",
                images: [
                    "https://images.unsplash.com/photo-1749869034096-1daa9214d668?w=800",
                    "https://images.unsplash.com/photo-1617817800495-ba4758d7fc7e?w=800",
                    "https://images.unsplash.com/photo-1753259167487-d8ffc8bc0dfd?w=800"
                ],
                category: "Day Trip",
                location: "1 hour from Tokyo",
                duration: "Full day",
                tips: "Daibutsu → Hase-dera → Enoshima beach"
            },
            {
                name: "Nikko",
                summary: "Tokugawa Ieyasu's 1617 mausoleum—15,000 craftsmen, 2.5M sheets of gold leaf",
                description: "The Toshogu shrine complex is so elaborately carved it took 15,000 craftsmen. The three wise monkeys ('see no evil') carving is here. Kegon Falls is 97 meters of waterfall. Autumn colors (October-November) are peak season. Tradeoff: 2+ hours each way. Start early or stay overnight. Worth it if you want mountains/nature.",
                price: "¥2,700 round-trip (Tobu Line)",
                url: "https://www.google.com/maps/place/Nikko",
                images: [
                    "https://images.unsplash.com/photo-1696252302905-eccf37382f9c?w=800",
                    "https://images.unsplash.com/photo-1757984357729-3bd783144405?w=800",
                    "https://images.unsplash.com/photo-1737816576598-e2f297e8cf8a?w=800"
                ],
                category: "Day Trip",
                location: "2 hours from Tokyo",
                duration: "Full day (leave early)",
                tips: "October-November for fall colors"
            },
            {
                name: "Yokohama",
                summary: "Japan's largest Chinatown (500+ restaurants) + Cup Noodles Museum",
                description: "Japan's biggest Chinatown has 500+ restaurants—get the steamed buns. Cup Noodles Museum lets you make your own instant ramen. The waterfront (Minato Mirai) has the Landmark Tower observation deck. Low-commitment day trip—feels like another Tokyo neighborhood. Tradeoff: Not as 'escape'-feeling as other options. More urban extension than getaway.",
                price: "¥500 round-trip train",
                url: "https://www.google.com/maps/place/Yokohama",
                images: [
                    "https://images.unsplash.com/photo-1587474064565-922e1178ec8f?w=800",
                    "https://images.unsplash.com/photo-1604674286849-81c0fb34ed4c?w=800",
                    "https://images.unsplash.com/photo-1529921946836-396661f0e442?w=800"
                ],
                category: "Day Trip",
                location: "30 min from Shibuya",
                duration: "Half day",
                tips: "Make custom Cup Noodles, eat Chinatown buns"
            }
        ]
    },
    kyoto: {
        daytime: [
            {
                name: "Fushimi Inari",
                summary: "Memoirs of a Geisha filmed here—10,000 torii gates, open 24/7",
                description: "Each torii was donated by a business (names on the back, prices from ¥400,000 to millions). The full loop takes 2-3 hours up and down Mt. Inari. Most tourists stop at the first viewpoint. Keep climbing—the crowds thin dramatically after the first 30 minutes. The shrine never closes. Tradeoff: By 9am it's Instagram chaos. Either go at 6am or accept you're here for vibes, not photos.",
                price: "Free",
                url: "http://inari.jp/en/",
                images: [
                    "https://images.unsplash.com/photo-1558862107-d49ef2a04d72?w=800",
                    "https://images.unsplash.com/photo-1563288611-49aace384220?w=800",
                    "https://images.unsplash.com/photo-1542767673-ee5103fedbb1?w=800"
                ],
                category: "Shrine",
                location: "Fushimi",
                coords: { lat: 34.9671, lng: 135.7727 },
                duration: "2-3 hours for full loop",
                tips: "6am or after sunset for photos"
            },
            {
                name: "Kinkaku-ji (Golden Pavilion)",
                summary: "A monk burned it down in 1950—Mishima wrote a novel about it",
                description: "The top two floors are covered in gold leaf. It burned down in 1950 (a monk did it—read Mishima's novel 'The Temple of the Golden Pavilion'). Rebuilt in 1955. You walk a set path around the pond and leave. Takes 30 minutes. Tradeoff: It's exactly what the photos look like. Worth seeing once, but don't expect more than the shot.",
                price: "¥500",
                url: "https://www.shokoku-ji.jp/en/kinkakuji/",
                images: [
                    "https://images.unsplash.com/photo-1693235717655-bbde6aa879a2?w=800",
                    "https://images.unsplash.com/photo-1698137363944-d34de2b00bce?w=800",
                    "https://images.unsplash.com/photo-1610265082060-7234c9de51ab?w=800"
                ],
                category: "Temple",
                location: "Kita-ku",
                coords: { lat: 35.0394, lng: 135.7292 },
                duration: "30-45 min",
                tips: "Combine with Ryoan-ji nearby"
            },
            {
                name: "Kiyomizu-dera",
                summary: "UNESCO site since 1994—wooden temple on 139 pillars, no nails",
                description: "The main hall's veranda juts out over the hillside on 139 wooden pillars. 'Jumping off Kiyomizu' is a Japanese expression for taking the plunge. (No, don't.) The approach streets—Ninenzaka and Sannenzaka—are preserved Edo-period shopping lanes. Lit up at night during special openings (spring/fall). Tradeoff: One of the most crowded spots in Kyoto. Go at opening (6am) or during evening illuminations.",
                price: "¥400",
                url: "https://www.kiyomizudera.or.jp/en/",
                images: [
                    "https://images.unsplash.com/photo-1636089041209-f19c76c34320?w=800",
                    "https://images.unsplash.com/photo-1637679105331-a0cea188b83e?w=800",
                    "https://images.unsplash.com/photo-1636089041212-21316c2fba75?w=800"
                ],
                category: "Temple",
                location: "Higashiyama",
                coords: { lat: 34.9949, lng: 135.7850 },
                duration: "1-2 hours with approach streets",
                tips: "6am or evening illuminations (seasonal)"
            },
            {
                name: "Arashiyama Bamboo Grove",
                summary: "Crouching Tiger filmed similar groves—Michelin 3-star natural landmark",
                description: "The main path is maybe 400 meters. It's free, it's always open, and by 9am it's a human conveyor belt. The light filtering through the bamboo is genuinely surreal at the right time. Combine with Tenryu-ji temple gardens (¥500) and the monkey park for a full morning. Tradeoff: The photo you want requires arriving before 7am. After that, you're in everyone else's shot.",
                price: "Free",
                url: "https://www.google.com/maps/place/Arashiyama+Bamboo+Grove",
                images: [
                    "https://images.unsplash.com/photo-1670735845005-09c877eb2853?w=800",
                    "https://images.unsplash.com/photo-1698618988744-737573cb6a7a?w=800",
                    "https://images.unsplash.com/photo-1702384225869-1efa3239b608?w=800"
                ],
                category: "Nature",
                location: "Arashiyama",
                coords: { lat: 35.0093, lng: 135.6677 },
                duration: "1-2 hours (with area)",
                tips: "Before 7am, or skip the photo dreams"
            },
            {
                name: "Gion District",
                summary: "Memoirs of a Geisha's setting—Japan's last working geisha district",
                description: "Wooden machiya townhouses, ochaya tea houses, and the occasional geiko or maiko (apprentice geisha) walking to appointments. Hanami-koji is the main street. Evening is best—5-7pm when they're heading to engagements. Do NOT follow, photograph without permission, or touch. It's become such a problem there are now photography bans on some streets. Tradeoff: The district itself is beautiful; the tourist behavior often isn't.",
                price: "Free",
                url: "https://www.google.com/maps/place/Gion",
                images: [
                    "https://images.unsplash.com/photo-1580639613257-5b1a20fe3760?w=800",
                    "https://images.unsplash.com/photo-1624253346805-df69ad2b3d7f?w=800",
                    "https://images.unsplash.com/photo-1594795716460-c816b5193a34?w=800"
                ],
                category: "District",
                location: "Gion",
                coords: { lat: 35.0039, lng: 135.7760 },
                duration: "1-2 hours",
                tips: "5-7pm for geiko sightings, don't be weird"
            },
            {
                name: "Nara Day Trip",
                summary: "Japan's first capital (710 AD)—world's largest bronze Buddha, deer that bow",
                description: "45 minutes from Kyoto. Buy shika senbei (deer crackers, ¥200) and watch the deer bow before snatching them. They will eat your map, ticket, shirt if you let them. Todai-ji temple has a 15-meter bronze Buddha from 752 AD—the building housing it is one of the world's largest wooden structures. Tradeoff: The deer are aggressive. Hide your food until you're ready. Half day is enough.",
                price: "¥620 train + ¥600 temple",
                url: "https://www.google.com/maps/place/Nara+Park",
                images: [
                    "https://images.unsplash.com/photo-1693380767492-00fb0bcc4ce6?w=800",
                    "https://images.unsplash.com/photo-1732629558099-2f5b913c0885?w=800",
                    "https://images.unsplash.com/photo-1652524606847-6eeaec21afdd?w=800"
                ],
                category: "Day Trip",
                location: "45 min from Kyoto",
                duration: "Half day",
                tips: "Deer bow = they want food now"
            }
        ],
        food: [
            {
                name: "Nishiki Market",
                summary: "400 years of 'Kyoto's Kitchen'—130 shops in 5 covered blocks",
                description: "Pickles (Kyoto has 100+ varieties), tofu, tsukemono, dried goods, grilled seafood on sticks. Highlights: Aritsugu knives (since 1560), Konnamonja for dashimaki tamago (sweet omelet), any pickle shop for free samples. Tradeoff: Very crowded, very expensive, and some stalls are tourist traps now. Eat your way through but skip anything that looks too polished.",
                price: "¥1,500-3,000 for a graze",
                url: "https://www.kyoto-nishiki.or.jp/en/",
                images: [
                    "https://images.unsplash.com/photo-1686538381343-ff6de76c8712?w=800",
                    "https://images.unsplash.com/photo-1701001909948-8048598fbc92?w=800",
                    "https://images.unsplash.com/photo-1732294346892-e0bb2cbc35b7?w=800"
                ],
                category: "Market",
                location: "Central Kyoto",
                coords: { lat: 35.0050, lng: 135.7647 },
                duration: "1-2 hours",
                tips: "Aritsugu for knives, sample pickles everywhere"
            },
            {
                name: "Kaiseki",
                summary: "Born from Zen Buddhist tea ceremony—Japan's original haute cuisine since 1400s",
                description: "The original Japanese haute cuisine: small courses, seasonal obsession, presentation as art. Kikunoi and Hyotei are multi-Michelin-starred institutions. But even mid-range kaiseki (¥8,000-15,000) will be memorable. Lunch is cheaper than dinner. Reserve days or weeks ahead. Tradeoff: ¥10,000-40,000 for dinner. Worth one splurge if Kyoto is about the food pilgrimage.",
                price: "¥8,000-40,000",
                url: "https://www.google.com/maps/search/kaiseki+kyoto",
                images: [
                    "https://images.unsplash.com/photo-1766582931800-fd79665257fa?w=800"
                ],
                category: "Fine Dining",
                location: "Various",
                duration: "2+ hours",
                tips: "Lunch kaiseki is cheaper, reserve ahead"
            },
            {
                name: "Pontocho Alley",
                summary: "400-year-old geisha entertainment district—riverside terraces open May-Sept",
                description: "One-meter-wide pedestrian alley between Kamo River and the main streets. Restaurants with riverside terraces (yuka) in summer, lanterns in winter. Mix of expensive kaiseki, casual izakaya, yakitori joints. Walking it at night is half the experience. Tradeoff: Can feel touristy. The alleys one street west (Kiyamachi) have more local spots.",
                price: "Varies by restaurant",
                url: "https://www.google.com/maps/place/Pontocho",
                images: [
                    "https://images.unsplash.com/photo-1652276317492-4350c854ae46?w=800",
                    "https://images.unsplash.com/photo-1557655562-7d6fc670bafc?w=800",
                    "https://images.unsplash.com/photo-1557655519-c019824acf8d?w=800"
                ],
                category: "Dining District",
                location: "Central Kyoto",
                coords: { lat: 35.0055, lng: 135.7707 },
                tips: "Walk through even if not eating"
            },
            {
                name: "Matcha in Uji",
                summary: "World's oldest tea shop (1160)—where matcha was invented for samurai and emperors",
                description: "Uji has produced matcha since the 12th century. Nakamura Tokichi is the famous spot—matcha parfaits, soba noodles with matcha, the works. Tsuen Tea is the world's oldest tea shop (since 1160). Get the usu-cha (thin tea) and thick parfait. Tradeoff: The famous spots have 30-60 min waits. The train ride is part of the experience if you have time.",
                price: "¥800-1,500",
                url: "https://www.google.com/maps/place/Uji",
                images: [
                    "https://images.unsplash.com/photo-1733982267382-1c37a14f206e?w=800",
                    "https://images.unsplash.com/photo-1751203659172-931598bb9423?w=800",
                    "https://images.unsplash.com/photo-1554185354-d7017cd363c7?w=800"
                ],
                category: "Dessert / Day Trip",
                location: "Uji (30 min from Kyoto)",
                duration: "2-3 hours",
                tips: "Nakamura Tokichi for parfait"
            }
        ],
        drinks: [
            {
                name: "Fushimi Sake District",
                summary: "Gekkeikan's been brewing here since 1637—samurai drank this before battle",
                description: "Gekkeikan and Kizakura breweries offer tours and tastings. The Gekkeikan Okura Sake Museum (¥600) includes tastings and a free sake cup. Kizakura has a beer brewery too. The water from underground springs makes the sake smooth and mild. Combine with Fushimi Inari, they're in the same area. Tradeoff: Tours are mostly in Japanese. The tastings translate fine.",
                price: "¥400-600 museum entry + tastings",
                url: "https://www.google.com/maps/search/Fushimi+sake+brewery",
                images: [
                    "https://images.unsplash.com/photo-1598191392914-c6b3616f6369?w=800",
                    "https://images.unsplash.com/photo-1691432633040-c31b6086742c?w=800",
                    "https://images.unsplash.com/photo-1653542636530-83f7e94b09eb?w=800"
                ],
                category: "Sake",
                location: "Fushimi (near Fushimi Inari)",
                coords: { lat: 34.9289, lng: 135.7564 },
                duration: "2-3 hours",
                tips: "Combine with Fushimi Inari visit"
            },
            {
                name: "Kyoto Brewing Company",
                summary: "RateBeer top-100 ranked—gaijin brewers making world-class saisons with yuzu",
                description: "Founded by American, Canadian, and Welsh brewers. Sansho (Japanese pepper) saison, yuzu pale ale, green tea IPA. The taproom is small but the beers are serious. 8 taps rotating, food available. One of Japan's best craft breweries. Tradeoff: Hard to find (basement location), small space. Worth hunting down if craft beer matters.",
                price: "¥700-900/beer",
                url: "https://kyotobrewing.com/",
                images: [
                    "https://images.unsplash.com/photo-1576402918429-1981f3b88b23?w=800",
                    "https://images.unsplash.com/photo-1752992492714-b7a216960914?w=800"
                ],
                category: "Craft Beer",
                location: "Central Kyoto",
                coords: { lat: 35.0125, lng: 135.7582 },
                duration: "1-2 hours",
                tips: "Basement location, hard to spot"
            }
        ]
    },
    osaka: {
        daytime: [
            {
                name: "Osaka Castle",
                summary: "Toyotomi Hideyoshi built this in 1583—unified Japan from here",
                description: "The original 1583 castle burned down multiple times. The current version is concrete with an elevator. The interior museum is skippable. But the grounds are huge, the moat is impressive, and it's a good morning walk with Osaka skyline photos. Tradeoff: Don't pay ¥600 to go inside unless you really want the view. Walk the grounds for free.",
                price: "Free (grounds) / ¥600 (interior)",
                url: "https://www.osakacastle.net/english/",
                images: [
                    "https://images.unsplash.com/photo-1723983555971-8dafb9032039?w=800",
                    "https://images.unsplash.com/photo-1580138051672-325eb98b2749?w=800",
                    "https://images.unsplash.com/photo-1629569320448-a5504a24d384?w=800"
                ],
                category: "Castle",
                location: "Chuo-ku",
                coords: { lat: 34.6873, lng: 135.5262 },
                duration: "1 hour (grounds)",
                tips: "Skip the interior, walk the moat"
            },
            {
                name: "Dotonbori",
                summary: "The Glico Running Man since 1935—Blade Runner 2049 filmed this strip",
                description: "The Glico Running Man sign. The mechanical crab. The pufferfish lantern. All the food: takoyaki, okonomiyaki, gyoza, kushikatsu. Go at night when the neon reflects off the canal. Eat standing up. It's loud, chaotic, and unapologetically fun. Tradeoff: Peak tourist zone. Prices are higher, queues are longer. That's the deal.",
                price: "Free to walk",
                url: "https://www.google.com/maps/place/Dotonbori",
                images: [
                    "https://images.unsplash.com/photo-1542210940661-5f91cb7afe02?w=800",
                    "https://images.unsplash.com/photo-1559866105-63d346cc87f3?w=800",
                    "https://images.unsplash.com/photo-1590253230532-a67f6bc61c9e?w=800"
                ],
                category: "District",
                location: "Namba",
                coords: { lat: 34.6687, lng: 135.5015 },
                duration: "2+ hours",
                tips: "Go at night for full neon effect"
            },
            {
                name: "Shinsekai",
                summary: "Built 1912 to rival NYC's Coney Island—Tsutenkaku modeled after Eiffel Tower",
                description: "Built in 1912 as a 'new world' amusement district, it declined, got rough, and now exists as retro-kitsch. Tsutenkaku Tower has Biliken (luck god) at the top—rub his feet. Below, kushikatsu restaurants line the streets. Grittier, more local feeling than Dotonbori. Tradeoff: Was actually rough until recently. Now it's tourist-friendly but still has edge.",
                price: "Free (tower ¥900)",
                url: "https://www.google.com/maps/place/Shinsekai",
                images: [
                    "https://images.unsplash.com/photo-1733693526950-de6dc514de5e?w=800",
                    "https://images.unsplash.com/photo-1725262568205-0bc09a6af2be?w=800",
                    "https://images.unsplash.com/photo-1675659262280-3233e6ad7674?w=800"
                ],
                category: "District",
                location: "Shinsekai",
                coords: { lat: 34.6525, lng: 135.5063 },
                duration: "2-3 hours",
                tips: "Eat kushikatsu here, not Dotonbori"
            },
            {
                name: "Universal Studios Japan",
                summary: "Super Nintendo World is a world-exclusive—Mario Kart AR ride exists nowhere else",
                description: "Mario Kart ride uses AR headsets. You get a Power-Up Band to punch blocks and collect coins. Wizarding World of Harry Potter is solid. The rest is standard Universal. Tradeoff: ¥8,600+ base, Express Pass adds ¥7,000-15,000. Goes to 10+ hours with lines. Nintendo World requires timed entry (get it via app at park opening or Express Pass). Book tickets weeks ahead.",
                price: "¥8,600-15,000+",
                url: "https://www.usj.co.jp/web/en/us",
                images: [
                    "https://images.unsplash.com/photo-1612404459571-ccef4b6588e7?w=800",
                    "https://images.unsplash.com/photo-1718965908210-a795ff8c9358?w=800",
                    "https://images.unsplash.com/photo-1718965909148-564c62389f54?w=800"
                ],
                category: "Theme Park",
                location: "Konohana-ku",
                coords: { lat: 34.6654, lng: 135.4323 },
                duration: "Full day",
                tips: "Get Nintendo World timed entry at opening"
            }
        ],
        food: [
            {
                name: "Takoyaki",
                summary: "Battered octopus balls cooked in half-spheres—Osaka invented this",
                description: "Crispy outside, molten inside, piece of octopus in the center. Topped with sauce, mayo, bonito flakes, green onion. Watch them flip with picks. Creo-Ru in Dotonbori is the moves—they use dashi broth in the batter. Tradeoff: You will burn your mouth. They're served nuclear-hot. Wait, or suffer.",
                price: "¥500-800 for 8 pieces",
                url: "https://www.google.com/maps/search/Takoyaki+Osaka",
                images: [
                    "https://images.unsplash.com/photo-1723802480207-8f3032039218?w=800",
                    "https://images.unsplash.com/photo-1652752731860-ef0cf518f13a?w=800",
                    "https://images.unsplash.com/photo-1738681335816-8e0df0aa9824?w=800"
                ],
                category: "Street Food",
                location: "Dotonbori, everywhere",
                tips: "Let them cool. Seriously."
            },
            {
                name: "Okonomiyaki",
                summary: "Mizuno's been #1 since 1945—Bourdain said 'this is the one' on No Reservations",
                description: "Cabbage, meat/seafood, and batter mixed together, griddled, topped with sauce, mayo, bonito, seaweed. Osaka-style (mixed) vs Hiroshima-style (layered). Mizuno in Dotonbori is famous—they use mountain yam for fluffiness. You cook it yourself at some places. Tradeoff: Mizuno has 30-60 min waits. Worth it or find another spot—there are hundreds.",
                price: "¥1,000-1,800",
                url: "https://www.google.com/maps/place/Mizuno+Okonomiyaki",
                images: [
                    "https://images.unsplash.com/photo-1629579436553-6b34e5ddd9de?w=800",
                    "https://images.unsplash.com/photo-1591114320268-fb3aac361d8e?w=800",
                    "https://images.unsplash.com/photo-1648221825803-4e02a95bf062?w=800"
                ],
                category: "Street Food",
                location: "Dotonbori",
                duration: "45-60 min",
                tips: "Mizuno for famous, or skip line and try anywhere"
            },
            {
                name: "Kushikatsu in Shinsekai",
                summary: "Daruma's been frying since 1929—the 'no double-dip' rule is sacred law here",
                description: "Meat, seafood, vegetables—breaded and fried on skewers. Dip once in the communal sauce. Double-dipping is a capital offense (signs are everywhere). Daruma is the famous chain. Order a set, add extras, drink beer. It's bar food elevated. Tradeoff: Shinsekai spots are better than Dotonbori ones. Make the trip.",
                price: "¥100-300/skewer",
                url: "https://www.google.com/maps/search/Kushikatsu+Shinsekai",
                images: [
                    "https://images.unsplash.com/photo-1764411768946-26e1c34f475d?w=800",
                    "https://images.unsplash.com/photo-1761314783320-e0adc5a4d7db?w=800",
                    "https://images.unsplash.com/photo-1758964114278-5123b0a6feb8?w=800"
                ],
                category: "Street Food",
                location: "Shinsekai",
                duration: "1 hour",
                tips: "NO double-dipping. Use the cabbage to scoop."
            },
            {
                name: "Kuromon Market",
                summary: "190 years of 'Osaka's Kitchen'—seafood-heavy, eat-as-you-go",
                description: "Fresh seafood stalls with grilled scallops, sea urchin, crab, tuna sashimi. Some let you pick live fish and cook it. Go hungry around 10am, graze for 2 hours. Tradeoff: Prices have climbed with tourism. It's not a secret anymore. Still worth it for the variety and atmosphere.",
                price: "¥2,000-5,000 for a graze",
                url: "https://kuromon.com/en/",
                images: [
                    "https://images.unsplash.com/photo-1573674451487-3c66c2aad5ba?w=800",
                    "https://images.unsplash.com/photo-1584583528653-966964d48bf1?w=800",
                    "https://images.unsplash.com/photo-1608516494623-2df85572e673?w=800"
                ],
                category: "Market",
                location: "Namba",
                coords: { lat: 34.6629, lng: 135.5065 },
                duration: "1.5-2 hours",
                tips: "Go at 10am, eat standing"
            }
        ],
        drinks: [
            {
                name: "Asahi Brewery Suita",
                summary: "Free tour + free beer at Japan's oldest Asahi brewery (1891)",
                description: "90-minute tour of the brewery where Asahi started. See the process, end with 3 free glasses of beer (fresh from tanks = noticeably different). Reserve online—English tours available. 20 min from central Osaka. Tradeoff: Need to reserve in advance, fills up. Worth it for beer people.",
                price: "Free",
                url: "https://www.asahibeer.co.jp/brewery/suita/",
                images: [
                    "https://images.unsplash.com/photo-1671766546440-ff3b9fbf2997?w=800",
                    "https://images.unsplash.com/photo-1552853041-59e6f459f83b?w=800",
                    "https://images.unsplash.com/photo-1623694130069-e27e39cbe94f?w=800"
                ],
                category: "Beer",
                location: "Suita (20 min from Osaka)",
                coords: { lat: 34.7589, lng: 135.5276 },
                duration: "90 min + transit",
                tips: "Reserve online, English tours available"
            },
            {
                name: "Hozenji Yokocho",
                summary: "Fudo-myo statue's been moss-covered since Edo period—splash water for luck",
                description: "Stone-paved alley with a moss-covered Buddha (splash water on him for luck). Quiet bars, small restaurants, actual atmosphere. The contrast with Dotonbori—literally 2 minutes away—is jarring. Good for a slower drink after the neon overload. Tradeoff: Drinks cost more. You're paying for the vibe.",
                price: "¥800-1,500/drink",
                url: "https://www.google.com/maps/place/Hozenji+Yokocho",
                images: [
                    "https://images.unsplash.com/photo-1542210993429-4f006c6ad7d9?w=800",
                    "https://images.unsplash.com/photo-1542211095816-026b5e72e17a?w=800",
                    "https://images.unsplash.com/photo-1729559149720-2b6c5c200428?w=800"
                ],
                category: "Bar Alley",
                location: "Namba (near Dotonbori)",
                coords: { lat: 34.6682, lng: 135.5022 },
                tips: "Splash water on Mizukake Fudo Buddha"
            }
        ]
    }
};

/* ========================================
   CARD FACTORY WITH IMAGE CAROUSEL
   ======================================== */

function createScrollCard(item, cardIndex) {
    const isFree = item.price && (item.price.toLowerCase() === 'free' || item.price.includes('Free'));
    const images = item.images || [];
    const hasMultipleImages = images.length > 1;

    // Generate carousel slides
    const slidesHtml = images.length > 0
        ? images.map((img, i) => `
            <div class="carousel-slide" style="background-image: url('${img}')" data-index="${i}"></div>
        `).join('')
        : '<div class="carousel-slide no-image"></div>';

    // Generate carousel dots
    const dotsHtml = hasMultipleImages
        ? `<div class="carousel-dots">
            ${images.map((_, i) => `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('')}
           </div>`
        : '';

    return `
        <div class="scroll-card" data-card-index="${cardIndex}">
            <div class="card-carousel">
                ${item.category ? `<span class="card-category">${item.category}</span>` : ''}
                ${hasMultipleImages ? `<span class="carousel-counter">1 / ${images.length}</span>` : ''}

                <div class="carousel-track" data-current="0">
                    ${slidesHtml}
                </div>

                ${hasMultipleImages ? `
                    <button class="carousel-btn prev" aria-label="Previous image">‹</button>
                    <button class="carousel-btn next" aria-label="Next image">›</button>
                ` : ''}

                ${dotsHtml}
            </div>

            <div class="card-content">
                <div class="card-header">
                    <h4 class="card-title">${item.name}</h4>
                    ${item.price ? `<span class="card-price ${isFree ? 'free' : ''}">${formatPriceWithUSD(item.price)}</span>` : ''}
                </div>

                <p class="card-summary">${item.summary}</p>

                <button class="description-toggle" aria-expanded="false">The Details</button>
                <div class="description-wrapper">
                    <p class="card-description">${item.description}</p>
                </div>

                <div class="card-meta">
                    ${item.location ? `<span><span class="icon">📍</span> ${item.location}</span>` : ''}
                    ${item.duration ? `<span><span class="icon">⏱</span> ${item.duration}</span>` : ''}
                    ${item.tips ? `<span><span class="icon">💡</span> ${item.tips}</span>` : ''}
                </div>

                ${item.url ? `<a href="${item.url}" target="_blank" class="card-link">Learn more →</a>` : ''}
            </div>
        </div>
    `;
}

function renderSection(containerId, title, items) {
    const container = document.getElementById(containerId);
    if (!container || !items || items.length === 0) return;

    const dotsHtml = items.map((_, i) =>
        `<button class="deck-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`
    ).join('');

    const html = `
        <div class="accordion-section-header">
            <span class="accordion-section-title">${title}</span>
            <span class="accordion-section-count">${items.length} options</span>
        </div>
        <div class="deck-container">
            <div class="horizontal-scroll" data-current="0">
                ${items.map((item, index) => createScrollCard(item, index)).join('')}
            </div>
        </div>
        <div class="deck-nav">
            <button class="deck-arrow prev" aria-label="Previous card">‹</button>
            <div class="deck-dots">${dotsHtml}</div>
            <button class="deck-arrow next" aria-label="Next card">›</button>
        </div>
    `;

    container.innerHTML = html;
}

function renderAllCards() {
    // Tokyo sections
    renderSection('tokyo-morning', 'Morning', activitiesData.tokyo.morning);
    renderSection('tokyo-daytime', 'Daytime Districts & Sights', activitiesData.tokyo.daytime);
    renderSection('tokyo-evening', 'Evening / Night', activitiesData.tokyo.evening);
    renderSection('tokyo-food', 'Food', activitiesData.tokyo.food);
    renderSection('tokyo-drinks', 'Drinks', activitiesData.tokyo.drinks);
    renderSection('tokyo-daytrips', 'Day Trips', activitiesData.tokyo.daytrips);

    // Kyoto sections
    renderSection('kyoto-daytime', 'Things to Do', activitiesData.kyoto.daytime);
    renderSection('kyoto-food', 'Food', activitiesData.kyoto.food);
    renderSection('kyoto-drinks', 'Drinks', activitiesData.kyoto.drinks);

    // Osaka sections
    renderSection('osaka-daytime', 'Things to Do', activitiesData.osaka.daytime);
    renderSection('osaka-food', 'Food', activitiesData.osaka.food);
    renderSection('osaka-drinks', 'Drinks', activitiesData.osaka.drinks);
}

/* ========================================
   DECK SWIPE NAVIGATION
   ======================================== */

function initDecks() {
    const decks = document.querySelectorAll('.horizontal-scroll');
    let activeDeck = null;

    decks.forEach(deck => {
        const cards = deck.querySelectorAll('.scroll-card');
        const container = deck.closest('.accordion-section') || deck.parentElement.parentElement;
        const nav = container.querySelector('.deck-nav');
        const dots = nav?.querySelectorAll('.deck-dot');
        const prevBtn = nav?.querySelector('.deck-arrow.prev');
        const nextBtn = nav?.querySelector('.deck-arrow.next');

        if (cards.length === 0) return;

        let currentIndex = 0;
        let startX = 0;
        let currentX = 0;

        // Set initial active card and position
        cards[0].classList.add('active');
        updateDeckNav();

        function getCardWidth() {
            const style = getComputedStyle(cards[0]);
            return cards[0].offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight);
        }

        function getCenterOffset() {
            const containerWidth = deck.parentElement.offsetWidth;
            const cardWidth = cards[0].offsetWidth;
            const cardMarginLeft = parseFloat(getComputedStyle(cards[0]).marginLeft);
            // Center the card content (not including margin)
            return (containerWidth - cardWidth) / 2 - cardMarginLeft;
        }

        function goToCard(index) {
            index = Math.max(0, Math.min(index, cards.length - 1));
            currentIndex = index;

            // Sync state object for document-level handlers
            if (deck._deckState) {
                deck._deckState.currentIndex = index;
            }

            const cardWidth = getCardWidth();
            const centerOffset = getCenterOffset();
            const scrollPos = index * cardWidth - centerOffset;

            deck.style.transform = `translateX(-${scrollPos}px)`;
            deck.style.transition = 'transform 0.3s ease';

            // Update active states
            cards.forEach((card, i) => {
                card.classList.toggle('active', i === index);
            });

            updateDeckNav();
        }

        function updateDeckNav() {
            if (dots) {
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }
            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === cards.length - 1;
        }

        // Store state on deck element for document-level mouse handlers
        deck._deckState = {
            currentIndex,
            startX,
            currentX,
            getCardWidth,
            getCenterOffset,
            goToCard,
            cards
        };

        // Initialize position
        requestAnimationFrame(() => goToCard(0));

        // Touch events
        let isDragging = false;
        deck.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            deck.style.transition = 'none';
        }, { passive: true });

        deck.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            const cardWidth = getCardWidth();
            const centerOffset = getCenterOffset();
            const baseOffset = currentIndex * cardWidth - centerOffset;
            deck.style.transform = `translateX(-${baseOffset - diff}px)`;
        }, { passive: true });

        deck.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const diff = currentX - startX;
            const threshold = 50;

            if (diff < -threshold && currentIndex < cards.length - 1) {
                goToCard(currentIndex + 1);
            } else if (diff > threshold && currentIndex > 0) {
                goToCard(currentIndex - 1);
            } else {
                goToCard(currentIndex);
            }
        });

        // Mouse drag events
        deck.addEventListener('mousedown', (e) => {
            // Ignore if clicking on buttons or links
            if (e.target.closest('button, a')) return;

            activeDeck = deck;
            startX = e.clientX;
            currentX = e.clientX;
            deck._deckState.startX = startX;
            deck._deckState.currentX = currentX;
            deck.classList.add('dragging');
            deck.style.transition = 'none';
            e.preventDefault();
        });

        // Arrow button clicks
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) goToCard(currentIndex - 1);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < cards.length - 1) goToCard(currentIndex + 1);
            });
        }

        // Dot clicks
        if (dots) {
            dots.forEach((dot, i) => {
                dot.addEventListener('click', () => goToCard(i));
            });
        }

        // Handle window resize
        window.addEventListener('resize', () => {
            goToCard(currentIndex);
        });
    });

    // Document-level mouse handlers for drag
    document.addEventListener('mousemove', (e) => {
        if (!activeDeck) return;
        const state = activeDeck._deckState;
        state.currentX = e.clientX;
        const diff = state.currentX - state.startX;
        const cardWidth = state.getCardWidth();
        const centerOffset = state.getCenterOffset();
        const baseOffset = state.currentIndex * cardWidth - centerOffset;
        activeDeck.style.transform = `translateX(-${baseOffset - diff}px)`;
    });

    document.addEventListener('mouseup', () => {
        if (!activeDeck) return;
        const state = activeDeck._deckState;
        activeDeck.classList.remove('dragging');

        const diff = state.currentX - state.startX;
        const threshold = 50;

        if (diff < -threshold && state.currentIndex < state.cards.length - 1) {
            state.goToCard(state.currentIndex + 1);
        } else if (diff > threshold && state.currentIndex > 0) {
            state.goToCard(state.currentIndex - 1);
        } else {
            state.goToCard(state.currentIndex);
        }

        activeDeck = null;
    });
}

/* ========================================
   CAROUSEL NAVIGATION
   ======================================== */

function initCarousels() {
    document.addEventListener('click', (e) => {
        // Handle description toggle
        if (e.target.classList.contains('description-toggle')) {
            const toggle = e.target;
            const wrapper = toggle.nextElementSibling;
            const isExpanded = toggle.classList.contains('expanded');

            toggle.classList.toggle('expanded');
            wrapper.classList.toggle('expanded');
            toggle.setAttribute('aria-expanded', !isExpanded);
        }

        // Handle prev/next buttons
        if (e.target.classList.contains('carousel-btn')) {
            e.preventDefault();
            const carousel = e.target.closest('.card-carousel');
            const track = carousel.querySelector('.carousel-track');
            const slides = track.querySelectorAll('.carousel-slide');
            const dots = carousel.querySelectorAll('.carousel-dot');
            const counter = carousel.querySelector('.carousel-counter');

            let current = parseInt(track.dataset.current) || 0;
            const total = slides.length;

            if (e.target.classList.contains('next')) {
                current = (current + 1) % total;
            } else if (e.target.classList.contains('prev')) {
                current = (current - 1 + total) % total;
            }

            updateCarousel(track, dots, counter, current, total);
        }

        // Handle dot clicks
        if (e.target.classList.contains('carousel-dot')) {
            const carousel = e.target.closest('.card-carousel');
            const track = carousel.querySelector('.carousel-track');
            const dots = carousel.querySelectorAll('.carousel-dot');
            const counter = carousel.querySelector('.carousel-counter');
            const total = track.querySelectorAll('.carousel-slide').length;
            const current = parseInt(e.target.dataset.index);

            updateCarousel(track, dots, counter, current, total);
        }
    });

    // Keyboard navigation for focused cards
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const focusedCard = document.activeElement.closest('.scroll-card');
            if (focusedCard) {
                const btn = focusedCard.querySelector(e.key === 'ArrowLeft' ? '.carousel-btn.prev' : '.carousel-btn.next');
                if (btn) btn.click();
            }
        }
    });
}

function updateCarousel(track, dots, counter, current, total) {
    track.style.transform = `translateX(-${current * 100}%)`;
    track.dataset.current = current;

    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
    });

    // Update counter
    if (counter) {
        counter.textContent = `${current + 1} / ${total}`;
    }
}

/* ========================================
   INTERACTIVE MAPS (Leaflet)
   ======================================== */

// Airbnb accommodation data
const airbnbData = {
    tokyo: [
        {
            name: "Shinjuku Rental Unit",
            summary: "3 bed · 6 beds · 2 bath",
            description: "Shinjuku City location - great for accessing nightlife and central Tokyo attractions.",
            location: "Shinjuku City",
            coords: { lat: 35.6938, lng: 139.7034 },
            url: "https://www.airbnb.com/rooms/1493595795907376215?adults=6&check_in=2026-04-09&check_out=2026-04-13&guests=8",
            rating: "4.82",
            category: "Accommodation"
        },
        {
            name: "Shinjuku Home",
            summary: "3 bed · 8 beds · 2 bath",
            description: "Shinjuku City location - fits larger groups with easy access to trains.",
            location: "Shinjuku City",
            coords: { lat: 35.6905, lng: 139.6985 },
            url: "https://www.airbnb.com/rooms/1543990239560296976?adults=8&check_in=2026-04-09&check_out=2026-04-13&guests=8",
            rating: "New",
            category: "Accommodation"
        },
        {
            name: "Taito City Place",
            summary: "2 bed · 10 beds · 2 bath",
            description: "Near Asakusa - walking distance to Senso-ji and traditional Tokyo.",
            location: "Taito City (near Asakusa)",
            coords: { lat: 35.7120, lng: 139.7910 },
            url: "https://www.airbnb.com/rooms/50765608?adults=6&check_in=2026-04-09&check_out=2026-04-13&guests=6",
            rating: "4.90",
            category: "Accommodation"
        }
    ],
    kyoto: [
        {
            name: "Kyoto Listing",
            summary: "View on Airbnb for details",
            description: "Kyoto accommodation option - click to view full details on Airbnb.",
            location: "Kyoto",
            coords: { lat: 35.0116, lng: 135.7681 },
            url: "https://www.airbnb.com/rooms/25818091",
            category: "Accommodation"
        },
        {
            name: "NEED MORE IDEAS",
            summary: "Search Gion area",
            description: "Traditional district, walkable to most sights - browse options in Gion.",
            location: "Gion",
            coords: { lat: 35.0039, lng: 135.7760 },
            url: "https://www.airbnb.com/s/Gion--Kyoto--Japan/homes",
            category: "Accommodation"
        },
        {
            name: "NEED MORE IDEAS",
            summary: "Search Kyoto Station area",
            description: "Easy train access - browse options near Kyoto Station.",
            location: "Kyoto Station",
            coords: { lat: 34.9858, lng: 135.7588 },
            url: "https://www.airbnb.com/s/Kyoto-Station--Kyoto--Japan/homes",
            category: "Accommodation"
        }
    ],
    osaka: [
        {
            name: "NEED MORE IDEAS",
            summary: "Search Dotonbori area",
            description: "Walking distance to everything, can be loud - browse options in Dotonbori.",
            location: "Dotonbori",
            coords: { lat: 34.6687, lng: 135.5015 },
            url: "https://www.airbnb.com/s/Dotonbori--Osaka--Japan/homes",
            category: "Accommodation"
        },
        {
            name: "NEED MORE IDEAS",
            summary: "Search Namba area",
            description: "Good transit access - browse options near Namba Station.",
            location: "Namba",
            coords: { lat: 34.6656, lng: 135.5013 },
            url: "https://www.airbnb.com/s/Namba--Osaka--Japan/homes",
            category: "Accommodation"
        },
        {
            name: "NEED MORE IDEAS",
            summary: "Search Shinsekai area",
            description: "More local, slightly grittier - browse options in Shinsekai.",
            location: "Shinsekai",
            coords: { lat: 34.6525, lng: 135.5063 },
            url: "https://www.airbnb.com/s/Shinsekai--Osaka--Japan/homes",
            category: "Accommodation"
        }
    ]
};

// Category color mapping
const categoryColors = {
    'Accommodation': '#e8e4dc',
    'Shrine': '#c53d43',
    'Temple': '#c53d43',
    'Museum': '#6a9fb5',
    'Park': '#88a65e',
    'Art': '#9b7bc7',
    'Views': '#f0a030',
    'Food': '#e07850',
    'Food & Drink': '#e07850',
    'Market': '#e07850',
    'District': '#5ba3c0',
    'Neighborhood': '#5ba3c0',
    'Shopping': '#5ba3c0',
    'Nightlife': '#d45087',
    'Bar Alley': '#d45087',
    'Ramen': '#e07850',
    'Tsukemen': '#e07850',
    'Tonkatsu': '#e07850',
    'Beef': '#e07850',
    'Tempura': '#e07850',
    'Monjayaki': '#e07850',
    'Unagi': '#e07850',
    'BBQ': '#e07850',
    'Yakitori': '#e07850',
    'Street Food': '#e07850',
    'Fine Dining': '#e07850',
    'Dining District': '#e07850',
    'Day Trip': '#88a65e',
    'Nature': '#88a65e',
    'Craft Beer': '#f0c030',
    'Beer': '#f0c030',
    'Sake': '#f0c030',
    'Whiskey': '#f0c030',
    'Castle': '#8b7355',
    'Theme Park': '#9b7bc7',
    'default': '#8a8580'
};

// City center coordinates and zoom levels
const cityConfigs = {
    tokyo: { center: [35.6762, 139.7003], zoom: 12 },
    kyoto: { center: [35.0116, 135.7681], zoom: 12 },
    osaka: { center: [34.6937, 135.5023], zoom: 12 }
};

// Store map instances
const maps = {};

function initMaps() {
    // Initialize maps for each city
    Object.keys(cityConfigs).forEach(city => {
        const mapContainer = document.getElementById(`${city}-map`);
        if (!mapContainer) return;

        // Create map with dark tiles
        const map = L.map(`${city}-map`, {
            scrollWheelZoom: false
        }).setView(cityConfigs[city].center, cityConfigs[city].zoom);

        // Use CartoDB Dark Matter tiles for dark theme
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);

        maps[city] = map;

        // Add pins for this city's activities
        addActivityPins(map, city);

        // Add Airbnb accommodation pins (larger)
        addAirbnbPins(map, city);

        // Build legend for this city
        buildLegend(city);
    });
}

function addActivityPins(map, city) {
    const cityData = activitiesData[city];
    if (!cityData) return;

    const categories = new Set();

    // Iterate through all sections (morning, daytime, evening, food, drinks, daytrips)
    Object.values(cityData).forEach(section => {
        if (!Array.isArray(section)) return;

        section.forEach(activity => {
            if (!activity.coords) return;

            const color = categoryColors[activity.category] || categoryColors.default;
            categories.add(activity.category);

            // Create circle marker (radius 8, shrunk 20% from 10)
            const marker = L.circleMarker([activity.coords.lat, activity.coords.lng], {
                radius: 6,
                fillColor: color,
                color: '#1a1918',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.4
            }).addTo(map);

            // Add tooltip on hover
            marker.bindTooltip(activity.name, {
                permanent: false,
                direction: 'top',
                className: 'map-tooltip'
            });

            // Open sidebar on click
            marker.on('click', () => openSidebar(activity));
        });
    });
}

function addAirbnbPins(map, city) {
    const cityAirbnbs = airbnbData[city];
    if (!cityAirbnbs) return;

    const color = categoryColors['Accommodation'];

    cityAirbnbs.forEach(airbnb => {
        if (!airbnb.coords) return;

        // Create larger circle marker for accommodations (radius 14)
        const marker = L.circleMarker([airbnb.coords.lat, airbnb.coords.lng], {
            radius: 9,
            fillColor: color,
            color: '#1a1918',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.5
        }).addTo(map);

        // Add tooltip on hover
        marker.bindTooltip(airbnb.name, {
            permanent: false,
            direction: 'top',
            className: 'map-tooltip'
        });

        // Open sidebar on click
        marker.on('click', () => openSidebar(airbnb));
    });
}

function buildLegend(city) {
    const legendContainer = document.getElementById(`${city}-legend`);
    if (!legendContainer) return;

    const cityData = activitiesData[city];
    if (!cityData) return;

    // Collect unique categories used in this city
    const usedCategories = new Set();
    Object.values(cityData).forEach(section => {
        if (!Array.isArray(section)) return;
        section.forEach(activity => {
            if (activity.coords && activity.category) {
                usedCategories.add(activity.category);
            }
        });
    });

    // Add Accommodation if this city has Airbnbs
    if (airbnbData[city] && airbnbData[city].length > 0) {
        usedCategories.add('Accommodation');
    }

    // Build legend HTML - put Accommodation first
    let html = '<div class="legend-items">';

    // Add Accommodation first with larger dot
    if (usedCategories.has('Accommodation')) {
        const color = categoryColors['Accommodation'];
        html += `<span class="legend-item"><span class="legend-dot legend-dot-large" style="background-color: ${color}"></span>Accommodation</span>`;
        usedCategories.delete('Accommodation');
    }

    usedCategories.forEach(category => {
        const color = categoryColors[category] || categoryColors.default;
        html += `<span class="legend-item"><span class="legend-dot" style="background-color: ${color}"></span>${category}</span>`;
    });
    html += '</div>';

    legendContainer.innerHTML = html;
}

/* ========================================
   ACTIVITY SIDEBAR
   ======================================== */

function openSidebar(activity) {
    const sidebar = document.getElementById('activity-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const content = sidebar.querySelector('.sidebar-content');

    // Build sidebar content (similar to card structure)
    const isFree = activity.price && (activity.price.toLowerCase() === 'free' || activity.price.includes('Free'));
    const images = activity.images || [];

    const imagesHtml = images.length > 0
        ? `<div class="sidebar-images">
            ${images.map((img, i) => `<img src="${img}" alt="${activity.name}" class="${i === 0 ? 'active' : ''}" />`).join('')}
            ${images.length > 1 ? `
                <div class="sidebar-image-nav">
                    <button class="sidebar-img-btn prev">&lsaquo;</button>
                    <span class="sidebar-img-counter">1 / ${images.length}</span>
                    <button class="sidebar-img-btn next">&rsaquo;</button>
                </div>
            ` : ''}
           </div>`
        : '';

    content.innerHTML = `
        ${imagesHtml}
        <div class="sidebar-body">
            ${activity.category ? `<span class="sidebar-category" style="background-color: ${categoryColors[activity.category] || categoryColors.default}">${activity.category}</span>` : ''}
            <h3 class="sidebar-title">${activity.name}</h3>
            ${activity.price ? `<span class="sidebar-price ${isFree ? 'free' : ''}">${formatPriceWithUSD(activity.price)}</span>` : ''}
            <p class="sidebar-summary">${activity.summary}</p>
            <p class="sidebar-description">${activity.description}</p>
            <div class="sidebar-meta">
                ${activity.location ? `<div class="meta-item"><span class="icon">📍</span> ${activity.location}</div>` : ''}
                ${activity.duration ? `<div class="meta-item"><span class="icon">⏱</span> ${activity.duration}</div>` : ''}
                ${activity.tips ? `<div class="meta-item"><span class="icon">💡</span> ${activity.tips}</div>` : ''}
            </div>
            ${activity.url ? `<a href="${activity.url}" target="_blank" class="sidebar-link">Learn more &rarr;</a>` : ''}
        </div>
    `;

    // Initialize image carousel in sidebar
    initSidebarCarousel(content);

    // Show sidebar
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    const sidebar = document.getElementById('activity-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function initSidebarCarousel(container) {
    const images = container.querySelectorAll('.sidebar-images img');
    const prevBtn = container.querySelector('.sidebar-img-btn.prev');
    const nextBtn = container.querySelector('.sidebar-img-btn.next');
    const counter = container.querySelector('.sidebar-img-counter');

    if (images.length <= 1) return;

    let current = 0;

    function updateImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        if (counter) {
            counter.textContent = `${index + 1} / ${images.length}`;
        }
        current = index;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            updateImage((current - 1 + images.length) % images.length);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            updateImage((current + 1) % images.length);
        });
    }
}

// Event listeners for sidebar
document.addEventListener('DOMContentLoaded', () => {
    // Close button
    const closeBtn = document.querySelector('.sidebar-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    // Overlay click
    const overlay = document.getElementById('sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // Initialize maps after a short delay to ensure containers are visible
    setTimeout(initMaps, 100);
});
