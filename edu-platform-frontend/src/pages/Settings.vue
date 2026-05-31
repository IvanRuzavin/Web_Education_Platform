<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const avatarStock = [
  "https://avatars.githubusercontent.com/u/583231?v=4",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2156.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2541.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2212.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2106.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2319.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2526.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2407.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2445.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2327.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2357.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2255.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2210.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2183.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2310.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2307.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2523.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2072.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2083.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2152.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2343.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2090.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2419.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2354.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2142.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2349.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2306.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2471.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2235.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2351.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2385.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2480.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2431.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2271.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2074.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2322.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2423.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2082.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2450.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2282.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2455.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2155.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2403.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2056.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2159.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2442.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2344.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2552.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2396.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2241.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2275.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2054.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2353.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2050.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2035.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2141.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2087.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2041.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2055.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2091.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2460.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2420.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2065.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2428.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2180.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2111.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2422.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2466.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2186.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2089.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2086.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2555.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2046.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2380.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2166.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2283.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2441.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2409.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2291.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2112.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2363.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2397.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2069.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2124.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2084.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2168.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2355.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2167.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2298.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2305.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2524.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2272.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2297.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2417.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2424.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2391.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2219.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2276.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2544.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2464.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2184.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2316.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2481.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2329.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2097.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2197.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2304.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2196.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2558.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2109.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2125.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2290.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2456.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2234.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2163.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2427.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2563.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2268.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2395.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2266.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2439.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2470.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2211.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2100.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2140.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2579.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2577.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2073.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2262.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2535.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2312.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2572.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2553.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2296.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2404.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2371.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2161.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2458.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2265.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2047.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2138.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2421.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2177.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2116.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2469.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2580.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2269.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2317.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2459.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2284.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2570.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2257.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2370.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2364.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2311.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2386.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2554.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2520.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2560.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2411.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2539.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2462.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2532.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2080.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2253.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2332.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2153.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2246.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2393.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2133.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2244.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2038.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2103.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2114.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2128.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2536.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2381.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2537.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2207.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2369.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2299.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2328.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2105.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2172.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2071.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2318.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2449.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2217.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2334.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2147.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2232.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2129.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2292.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2252.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2401.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2242.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2122.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2288.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2033.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2192.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2261.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2562.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2260.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2228.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2410.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2561.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2573.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2049.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2121.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2374.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2247.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2225.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2070.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2413.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2248.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2231.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2053.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2556.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2382.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2347.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2063.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2075.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2399.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2245.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2149.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2187.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2372.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2157.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2443.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2534.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2094.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2429.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2335.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2453.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2478.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2542.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2468.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2548.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2325.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2289.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2150.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2108.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2433.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2389.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2323.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2174.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2030.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2067.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2415.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2267.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2378.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2098.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2045.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2126.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2243.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2110.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2550.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2576.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2339.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2230.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2079.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2115.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2575.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2088.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2528.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2059.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2418.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2400.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2223.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2195.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2373.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2188.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2182.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2221.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2465.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2549.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2178.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2547.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2119.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2130.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2525.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2398.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2485.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2206.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2193.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2131.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2434.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2484.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2205.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2190.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2052.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2321.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2048.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2341.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2303.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2571.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2185.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2222.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2326.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2032.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2368.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2176.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2214.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2040.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2346.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2440.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2454.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2104.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2066.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2430.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2436.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2250.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2036.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2136.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2078.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2408.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2264.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2377.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2437.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2240.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2361.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2308.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2113.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2320.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2295.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2204.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2477.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2522.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2366.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2224.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2127.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2315.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2444.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2365.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2324.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2392.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2273.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2173.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2233.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2132.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2574.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2139.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2058.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2414.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2274.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2340.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2352.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2144.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2405.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2533.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2062.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2202.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2360.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2529.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2236.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2293.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2263.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2102.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2463.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2331.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2137.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2194.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2123.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2538.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2162.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2379.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2394.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2479.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2546.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2286.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2359.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2237.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2179.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2280.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2120.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2251.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2239.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2350.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2229.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2148.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2077.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2085.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2337.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2044.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2281.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2143.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2238.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2034.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2376.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2201.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2031.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2294.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2384.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2301.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2527.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2096.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2406.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2209.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2568.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2270.jpg",
  "https://x.boardgamearena.net/data/avatar/defaults/default-2164.jpg"
];

const uid = localStorage.getItem("uid");
const router = useRouter();

const user = ref(null);

const uidValue = ref("");
const name = ref("");
const surname = ref("");
const avatar = ref("");

const email = ref("");
const birthplace = ref("");
const phone = ref("");
const password = ref("");

onMounted(async () => {
  const res = await api.get(`/users/${uid}`);

  user.value = res.data;

  uidValue.value = res.data.uid;
  name.value = res.data.name;
  surname.value = res.data.surname;

  avatar.value = res.data.avatar;

  email.value = res.data.email;
  birthplace.value = res.data.birthplace;
  phone.value = res.data.phone;
});

const save = async () => {
  await api.put(`/users/${uid}`, {
    password: password.value,

    avatar: avatar.value,

    email: email.value,
    birthplace: birthplace.value,
    phone: phone.value
  });

  alert("Profile updated");

  router.push("/home");
};

const selectAvatar = (url: string) => {
  avatar.value = url;
};
</script>

<template>
  <div class="dashboard-settings">

    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">

      <button
        class="sidebar-home"
        @click="router.push('/home')"
      >
        <i class="bi bi-house-fill"></i>
        <span>Home</span>
      </button>

      <button
        class="sidebar-icon"
        @click="router.push('/graph')"
      >
        <i class="bi bi-graph-up"></i>
      </button>

      <button
        class="sidebar-icon"
        @click="router.push('/settings')"
      >
        <i class="bi bi-gear-fill"></i>
      </button>

    </aside>

    <div class="main-content">

      <!-- TOP NAVBAR -->
      <nav class="top-navbar" v-if="user">

        <div class="navbar-title">
          Embedded EDU Platform
        </div>

        <button
          class="user-navbar-btn"
          @click="router.push('/home')"
        >

          <img
            :src="user.avatar"
            class="navbar-avatar"
            :alt="user.uid"
          >

          <span>
            {{ user.uid }}
          </span>

        </button>

      </nav>

      <!-- Preview -->
      <div class="card shadow-sm mb-4">

        <div class="card-body">

          <div class="d-flex align-items-center gap-4">

            <img
              :src="avatar"
              class="preview-avatar"
            >

            <div>

              <h3>
                {{ name }} {{ surname }}
              </h3>

              <p class="text-muted mb-0">
                {{ uidValue }}
              </p>

            </div>

          </div>

        </div>

      </div>

      <!-- Personal -->

      <div class="card shadow-sm mt-4">

        <div class="card-header">
          <h5 class="mb-0">
            Personal Information
          </h5>
        </div>

        <div class="card-body">

          <div class="row">

            <div class="col-md-3">

              <label class="form-label">
                Email
              </label>

              <input
                class="form-control"
                v-model="email"
              >

            </div>

            <div class="col-md-3">

              <label class="form-label">
                Phone
              </label>

              <input
                class="form-control"
                v-model="phone"
              >

            </div>

            <div class="col-md-3">

              <label class="form-label">
                Birthplace
              </label>

              <input
                class="form-control"
                v-model="birthplace"
              >

            </div>

            <div class="col-md-3">

              <label class="form-label">
                New Password
              </label>

              <input
                type="password"
                class="form-control"
                v-model="password"
              >

            </div>

          </div>

        </div>

      </div>

      <div class="row g-4">

        <!-- Avatar -->

        <div>

          <div class="card shadow-sm">

            <div class="card-header">
              <h5 class="mb-0">
                Avatar
              </h5>
            </div>

            <div class="card-body">

              <div class="mb-3">

                <label class="form-label">
                  Avatar URL
                </label>

                <input
                  class="form-control"
                  v-model="avatar"
                >

              </div>

              <div class="avatar-grid">

                <img
                  v-for="a in avatarStock"
                  :key="a"
                  :src="a"
                  class="avatar-option"
                  :class="{ selected: avatar === a }"
                  @click="selectAvatar(a)"
                >

              </div>

            </div>

          </div>

        </div>

      </div>

      <div class="mt-4 text-end">

        <button
          class="btn btn-success btn-lg"
          @click="save"
        >
          <i class="bi bi-floppy"></i>
          Save Changes
        </button>

      </div>

    </div>
  </div>
</template>

<style scope>
.preview-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.avatar-option {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 3px solid transparent;
}

.avatar-option:hover {
  transform: scale(1.05);
}

.avatar-option.selected {
  border-color: #0d6efd;
}

.dashboard-settings {
  position: relative;
  min-height: 100vh;

  display: flex;

  background-image:
    url("https://www.electronicspecifier.com/wp-content/uploads/2025/12/Microchip_design.jpg");

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  overflow: hidden;
}

</style>