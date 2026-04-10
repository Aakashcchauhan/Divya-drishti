# Audit Report

## Project Metadata
- Project Name: a1enterprises
- Audit Date: 2026-04-10T06:47:47.571Z
- Files Scanned: 162
- Audit Version: v1.0.0
- Target: a1enterprises
- Target Path: F:\Study\5 project\a1enterprises

## Executive Summary

The system shows Critical Risk.

Critical risks include:
- Infinite loop detected (logic)
- DOM-based XSS Risk (security)
- DOM-based XSS Risk (security)

These issues may lead to system instability, security vulnerabilities, or degraded user experience.
Severity profile: Critical 1, High 13, Medium 211, Low 0.

## Scan Diagnostics

- Files discovered: 162
- Files scannable: 162
- Files skipped: 0
- Files errored: 0
- Total scan time: 3716 ms

| Scanner | Files Visited | Findings | Failures | Duration (ms) |
|---------|---------------|----------|----------|---------------|
| security_scanner | 162 | 29 | 0 | 658 |
| logic_scanner | 162 | 2773 | 0 | 108 |
| performance_scanner | 162 | 148 | 0 | 513 |

## Severity Breakdown

| Critical | High | Medium | Low |
|----------|------|--------|-----|
| 1 | 13 | 211 | 0 |

## Overall Risk Level

- Critical Risk
- Health Score: F

## Key Findings

- Security: DOM-based XSS Risk
- Logic: Infinite loop detected
- Performance: Expensive computation inside loop
- UI/UX: UI skeleton opportunity detected (complex-grid layout)

## Detailed Findings

#### [INFINITE_LOOP_83] Infinite loop detected

- Category: logic
- Severity: critical
- File: src\app\api\admin\products\[id]\route.js:83

**Description**
Loop condition is a constant true and no termination check is visible.

**Impact**
[object Object]

**Fix**
Ensure loop has a proper exit condition.

**Confidence**
confirmed

**Code Evidence**
```
while (true)
```

---

#### [XSS_DOM_136] DOM-based XSS Risk

- Category: security
- Severity: high
- File: src\app\layout.js:136
- CWE: CWE-79

**Description**
Execution of malicious scripts in client environment.

**Impact**
Execution of malicious scripts in client environment.

**Fix**
Sanitize input or use safe rendering methods.

**Confidence**
likely

**Code Evidence**
```
dangerouslySetInnerHTML={{
```

---

#### [XSS_DOM_157] DOM-based XSS Risk

- Category: security
- Severity: high
- File: src\app\layout.js:157
- CWE: CWE-79

**Description**
Execution of malicious scripts in client environment.

**Impact**
Execution of malicious scripts in client environment.

**Fix**
Sanitize input or use safe rendering methods.

**Confidence**
likely

**Code Evidence**
```
dangerouslySetInnerHTML={{
```

---

#### [XSS_DOM_173] DOM-based XSS Risk

- Category: security
- Severity: high
- File: src\app\layout.js:173
- CWE: CWE-79

**Description**
Execution of malicious scripts in client environment.

**Impact**
Execution of malicious scripts in client environment.

**Fix**
Sanitize input or use safe rendering methods.

**Confidence**
likely

**Code Evidence**
```
dangerouslySetInnerHTML={{
```

---

#### [XSS_DOM_150] DOM-based XSS Risk

- Category: security
- Severity: high
- File: src\components\BrandShowcase.jsx:150
- CWE: CWE-79

**Description**
Execution of malicious scripts in client environment.

**Impact**
Execution of malicious scripts in client environment.

**Fix**
Sanitize input or use safe rendering methods.

**Confidence**
likely

**Code Evidence**
```
e.target.parentNode.innerHTML = `
```

---

#### [SQL_INJECTION_373] Potential SQL Injection

- Category: security
- Severity: high
- File: src\components\Admin\EditProductForm.jsx:373
- CWE: CWE-89

**Description**
Database compromise due to unsafe query construction.

**Impact**
Database compromise due to unsafe query construction.

**Fix**
Use parameterized queries or ORM.

**Confidence**
likely

**Code Evidence**
```
alert('Failed to update product: ' + error.message);
```

---

#### [INFINITE_LOOP_RISK_83] Potential infinite loop

- Category: logic
- Severity: high
- File: src\app\api\admin\products\[id]\route.js:83

**Description**
Loop has no clear exit condition.

**Impact**
CPU exhaustion and application freeze.

**Fix**
Ensure loop has a valid exit condition.

**Confidence**
confirmed

**Code Evidence**
```
while (true) {
```

---

#### [N_PLUS_ONE_QUERY_5] Possible N+1 query pattern

- Category: logic
- Severity: high
- File: src\app\api\products\upload-image\route.js:5

**Description**
Multiple database calls inside loop causing severe slowdown.

**Impact**
[object Object]

**Fix**
Batch database calls or use optimized queries.

**Confidence**
confirmed

**Code Evidence**
```
const formData = await request.formData();
```

---

#### [N_PLUS_ONE_QUERY_20] Possible N+1 query pattern

- Category: logic
- Severity: high
- File: src\app\api\admin\update-banner\route.js:20

**Description**
Multiple database calls inside loop causing severe slowdown.

**Impact**
[object Object]

**Fix**
Batch database calls or use optimized queries.

**Confidence**
confirmed

**Code Evidence**
```
const formData = await request.formData();
```

---

#### [FINDING_1775803667569_oexj8f] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: high
- File: src\components\ProductSection.jsx:N/A

**Description**
Detected UI blocks in src\components\ProductSection.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Apply skeleton immediately to improve perceived performance.

**Confidence**
likely

---

#### [FINDING_1775803667569_avs1nf] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: high
- File: src\components\FeaturedProductsSwitcher.jsx:N/A

**Description**
Detected UI blocks in src\components\FeaturedProductsSwitcher.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Apply skeleton immediately to improve perceived performance.

**Confidence**
likely

---

#### [FINDING_1775803667569_6v87f2] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: high
- File: src\components\FeaturedProduct.jsx:N/A

**Description**
Detected UI blocks in src\components\FeaturedProduct.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Apply skeleton immediately to improve perceived performance.

**Confidence**
likely

---

#### [FINDING_1775803667569_krz161] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: high
- File: src\app\(public)\all-products\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\all-products\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Apply skeleton immediately to improve perceived performance.

**Confidence**
likely

---

#### [FINDING_1775803667569_jb1jac] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: high
- File: src\app\(public)\all-products\[type]\[title]\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\all-products\[type]\[title]\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Apply skeleton immediately to improve perceived performance.

**Confidence**
likely

---

#### [INSECURE_RANDOM_63] Insecure Random Generator

- Category: security
- Severity: medium
- File: src\utils\avatarHelpers.js:63
- CWE: CWE-338

**Description**
Predictable values in security-sensitive contexts.

**Impact**
Predictable values in security-sensitive contexts.

**Fix**
Use crypto-secure random generators.

**Confidence**
likely

**Code Evidence**
```
const randomIndex = Math.floor(Math.random() * AVATAR_COLORS.length);
```

---

#### [INSECURE_RANDOM_75] Insecure Random Generator

- Category: security
- Severity: medium
- File: src\utils\avatarHelpers.js:75
- CWE: CWE-338

**Description**
Predictable values in security-sensitive contexts.

**Impact**
Predictable values in security-sensitive contexts.

**Fix**
Use crypto-secure random generators.

**Confidence**
likely

**Code Evidence**
```
const randomTimestamp = pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
```

---

#### [INSECURE_RANDOM_12] Insecure Random Generator

- Category: security
- Severity: medium
- File: src\components\ToastContainer.jsx:12
- CWE: CWE-338

**Description**
Predictable values in security-sensitive contexts.

**Impact**
Predictable values in security-sensitive contexts.

**Fix**
Use crypto-secure random generators.

**Confidence**
likely

**Code Evidence**
```
const id = Date.now() + Math.random();
```

---

#### [INSECURE_RANDOM_121] Insecure Random Generator

- Category: security
- Severity: medium
- File: src\app\admin\products\page.jsx:121
- CWE: CWE-338

**Description**
Predictable values in security-sensitive contexts.

**Impact**
Predictable values in security-sensitive contexts.

**Fix**
Use crypto-secure random generators.

**Confidence**
likely

**Code Evidence**
```
userId: `MANUAL_USER_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
```

---

#### [INSECURE_RANDOM_122] Insecure Random Generator

- Category: security
- Severity: medium
- File: src\app\admin\products\page.jsx:122
- CWE: CWE-338

**Description**
Predictable values in security-sensitive contexts.

**Impact**
Predictable values in security-sensitive contexts.

**Fix**
Use crypto-secure random generators.

**Confidence**
likely

**Code Evidence**
```
orderId: `MANUAL_ORDER_${Math.random().toString(36).toUpperCase().substr(2, 8)}`,
```

---

#### [INSECURE_RANDOM_383] Insecure Random Generator

- Category: security
- Severity: medium
- File: src\app\api\products\generate-ai\route.js:383
- CWE: CWE-338

**Description**
Predictable values in security-sensitive contexts.

**Impact**
Predictable values in security-sensitive contexts.

**Fix**
Use crypto-secure random generators.

**Confidence**
likely

**Code Evidence**
```
const randomNum = Math.floor(1000 + Math.random() * 9000);
```

---

#### [INSECURE_RANDOM_91] Insecure Random Generator

- Category: security
- Severity: medium
- File: src\app\api\admin\export-products\route.js:91
- CWE: CWE-338

**Description**
Predictable values in security-sensitive contexts.

**Impact**
Predictable values in security-sensitive contexts.

**Fix**
Use crypto-secure random generators.

**Confidence**
likely

**Code Evidence**
```
const randomGTIN = Math.floor(100000 + Math.random() * 900000).toString();
```

---

#### [DIRECT_OBJECT_REFERENCE_19] Direct object reference without validation

- Category: logic
- Severity: medium
- File: src\components\AmazonSearchInput.jsx:19

**Description**
User-controlled identifiers are used without validation or authorization checks.

**Impact**
Unauthorized data access or IDOR vulnerability.

**Fix**
Validate and authorize all user-controlled identifiers before use.

**Confidence**
likely

**Code Evidence**
```
export default function AmazonSearchInput({
```

---

#### [REPEATED_COMPUTATION_10] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\lib\roleHelpers.js:10

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
updatedAt: new Date().toISOString(),
```

---

#### [REPEATED_COMPUTATION_256] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\lib\emailService.js:256

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
${new Date(order.createdAt || order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
```

---

#### [REPEATED_COMPUTATION_452] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\lib\emailService.js:452

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
© ${new Date().getFullYear()} A1 Enterprises. All rights reserved.<br>
```

---

#### [REPEATED_COMPUTATION_567] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\lib\emailService.js:567

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
${new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
```

---

#### [REPEATED_COMPUTATION_647] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\lib\emailService.js:647

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
<span style="color: #111827; font-size: 14px; font-weight: 500;">${new Date(orderDetails.createdAt || orderDetails.orderDate || Date.now()).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
```

---

#### [REPEATED_COMPUTATION_735] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\lib\emailService.js:735

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
© ${new Date().getFullYear()} A1 Enterprises. All rights reserved.
```

---

#### [REPEATED_COMPUTATION_48] Expensive computation inside loop

- Category: logic
- Severity: medium
- File: src\utils\helpers.js:48

**Description**
Repeated heavy utility call detected within an iterative loop body.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
Math.min in loop
```

---

#### [REPEATED_COMPUTATION_73] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\utils\avatarHelpers.js:73

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const now = new Date();
```

---

#### [REPEATED_COMPUTATION_74] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\utils\avatarHelpers.js:74

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const pastDate = new Date(now.getTime() - (months * 30 * 24 * 60 * 60 * 1000));
```

---

#### [REPEATED_COMPUTATION_76] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\utils\avatarHelpers.js:76

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
return new Date(randomTimestamp);
```

---

#### [REPEATED_COMPUTATION_141] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\utils\avatarHelpers.js:141

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const dateObj = typeof date === 'string' ? new Date(date) : date;
```

---

#### [MISSING_MEMO_12] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\hooks\useAdminAuth.js:12

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [MISSING_MEMO_4] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\context\CartContext.js:4

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const CartContext = createContext();
```

---

#### [MISSING_MEMO_7] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\context\AuthContext.js:7

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const AuthContext = createContext({});
```

---

#### [MISSING_MEMO_6] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\context\WishlistContext.js:6

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const WishlistContext = createContext({});
```

---

#### [MISSING_MEMO_13] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\Toast.jsx:13

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const timer = setTimeout(() => {
```

---

#### [MISSING_MEMO_14] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\TestimonialsCarousel.jsx:14

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchOverallStats = async () => {
```

---

#### [MISSING_MEMO_9] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\UserRoute.jsx:9

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [REPEATED_COMPUTATION_35] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\sitemap.js:35

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
lastModified: new Date(),
```

---

#### [REPEATED_COMPUTATION_133] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\sitemap.js:133

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
lastModified: new Date(product.updatedAt || product.createdAt || Date.now()),
```

---

#### [REPEATED_COMPUTATION_140] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\layout.js:140

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
gtag('js', new Date());
```

---

#### [MISSING_MEMO_7] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\Review.jsx:7

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const sectionRef = useRef(null);
```

---

#### [MISSING_MEMO_16] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\ProductSchema.jsx:16

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const schema = {
```

---

#### [MISSING_MEMO_14] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\ProductTypeBanners.jsx:14

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const res = await fetch('/api/products/types');
```

---

#### [CACHE_OPPORTUNITY_14] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\ProductTypeBanners.jsx:14

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const res = await fetch('/api/products/types');
```

---

#### [MISSING_MEMO_9] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\PublicRoute.jsx:9

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [MISSING_MEMO_19] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\ProductReviews.jsx:19

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchReviews = async () => {
```

---

#### [CACHE_OPPORTUNITY_32] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\ProductReviews.jsx:32

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch(`/api/reviews?${params}`);
```

---

#### [API_CALL_BURST_30] Multiple API calls detected

- Category: logic
- Severity: medium
- File: src\components\OrderHistory.js:30

**Description**
High count of outbound API invocations suggests batching opportunity.

**Impact**
[object Object]

**Fix**
Batch API calls or use a bulk endpoint to reduce network overhead.

**Confidence**
likely

**Code Evidence**
```
Detected 4 API call sites in this file
```

---

#### [MISSING_MEMO_23] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\OrderHistory.js:23

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const itemsPerPage = 4;
```

---

#### [CACHE_OPPORTUNITY_30] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\OrderHistory.js:30

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
fetch(`/api/orders/email/${encodeURIComponent(email)}`)
```

---

#### [MISSING_MEMO_9] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\PrivateRoute.jsx:9

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [MISSING_MEMO_7] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\HeroSlider.jsx:7

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const slides = [
```

---

#### [CACHE_OPPORTUNITY_76] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\ProductSlider.jsx:76

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const settingsResponse = await fetch('/api/admin/homepage-settings')
```

---

#### [MISSING_MEMO_11] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\CollectionSection.jsx:11

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const collections = [
```

---

#### [MISSING_MEMO_15] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\BreadcrumbSchema.jsx:15

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const schema = {
```

---

#### [MISSING_MEMO_17] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\Navbar.jsx:17

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [CACHE_OPPORTUNITY_32] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\BestCollection1.jsx:32

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const settingsResponse = await fetch('/api/admin/homepage-settings');
```

---

#### [EVENT_LOOP_BLOCKING_49] Heavy JSON parsing may block event loop

- Category: logic
- Severity: medium
- File: src\components\AmazonSearchInput.jsx:49

**Description**
File size is large and synchronous JSON parsing appears in code path.

**Impact**
[object Object]

**Fix**
Move large JSON parsing to background worker or chunk processing.

**Confidence**
likely

**Code Evidence**
```
JSON.parse on potentially large input
```

---

#### [MISSING_MEMO_41] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\AmazonSearchInput.jsx:41

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const inputRef = useRef(null);
```

---

#### [REPEATED_COMPUTATION_33] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\test-email\route.js:33

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
createdAt: new Date(),
```

---

#### [REPEATED_COMPUTATION_34] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\test-email\route.js:34

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
orderDate: new Date(),
```

---

#### [MISSING_MEMO_14] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\(public)\FeaturedProductsSwitcherWrapper.jsx:14

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchProducts = async () => {
```

---

#### [MISSING_MEMO_15] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\Admin\ProtectedRoute.jsx:15

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [API_CALL_BURST_60] Multiple API calls detected

- Category: logic
- Severity: medium
- File: src\components\Admin\ModernDashboard.jsx:60

**Description**
High count of outbound API invocations suggests batching opportunity.

**Impact**
[object Object]

**Fix**
Batch API calls or use a bulk endpoint to reduce network overhead.

**Confidence**
likely

**Code Evidence**
```
Detected 4 API call sites in this file
```

---

#### [MISSING_MEMO_56] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\Admin\ModernDashboard.jsx:56

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchDashboardData = async () => {
```

---

#### [CACHE_OPPORTUNITY_60] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\Admin\ModernDashboard.jsx:60

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
fetch('/api/admin/dashboard/stats'),
```

---

#### [MISSING_MEMO_58] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\Admin\DashboardStats.jsx:58

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchDashboardStats = async () => {
```

---

#### [CACHE_OPPORTUNITY_61] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\Admin\DashboardStats.jsx:61

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch('/api/admin/dashboard/stats');
```

---

#### [API_CALL_BURST_75] Multiple API calls detected

- Category: logic
- Severity: medium
- File: src\components\Admin\EditProductForm.jsx:75

**Description**
High count of outbound API invocations suggests batching opportunity.

**Impact**
[object Object]

**Fix**
Batch API calls or use a bulk endpoint to reduce network overhead.

**Confidence**
likely

**Code Evidence**
```
Detected 5 API call sites in this file
```

---

#### [MISSING_MEMO_53] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\Admin\EditProductForm.jsx:53

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const commonColors = [
```

---

#### [CACHE_OPPORTUNITY_75] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\Admin\EditProductForm.jsx:75

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch('/api/products/types');
```

---

#### [API_CALL_BURST_78] Multiple API calls detected

- Category: logic
- Severity: medium
- File: src\components\Admin\AddProductForm.jsx:78

**Description**
High count of outbound API invocations suggests batching opportunity.

**Impact**
[object Object]

**Fix**
Batch API calls or use a bulk endpoint to reduce network overhead.

**Confidence**
likely

**Code Evidence**
```
Detected 5 API call sites in this file
```

---

#### [MISSING_MEMO_56] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\Admin\AddProductForm.jsx:56

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const commonColors = [
```

---

#### [CACHE_OPPORTUNITY_78] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\Admin\AddProductForm.jsx:78

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch('/api/products/types');
```

---

#### [MISSING_MEMO_22] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\components\Card\Enquiry.jsx:22

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchUserProfile = async () => {
```

---

#### [CACHE_OPPORTUNITY_26] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\components\Card\Enquiry.jsx:26

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const res = await fetch(`/api/user/${encodeURIComponent(user.email)}`, {
```

---

#### [REPEATED_COMPUTATION_66] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\contact\route.js:66

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const submissionDate = new Date().toLocaleString("en-US", {
```

---

#### [REPEATED_COMPUTATION_273] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\contact\route.js:273

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
timestamp: new Date().toISOString()
```

---

#### [REPEATED_COMPUTATION_287] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\contact\route.js:287

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
timestamp: new Date().toISOString(),
```

---

#### [REPEATED_COMPUTATION_47] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\notifications\route.js:47

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
existingNotification.createdAt = new Date();
```

---

#### [MISSING_MEMO_19] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\users\page.js:19

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchUsers = async () => {
```

---

#### [API_CALL_BURST_52] Multiple API calls detected

- Category: logic
- Severity: medium
- File: src\app\admin\products\page.jsx:52

**Description**
High count of outbound API invocations suggests batching opportunity.

**Impact**
[object Object]

**Fix**
Batch API calls or use a bulk endpoint to reduce network overhead.

**Confidence**
likely

**Code Evidence**
```
Detected 4 API call sites in this file
```

---

#### [MISSING_MEMO_15] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\products\page.jsx:15

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [CACHE_OPPORTUNITY_52] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\admin\products\page.jsx:52

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch('/api/products');
```

---

#### [API_CALL_BURST_22] Multiple API calls detected

- Category: logic
- Severity: medium
- File: src\app\admin\orders\page.jsx:22

**Description**
High count of outbound API invocations suggests batching opportunity.

**Impact**
[object Object]

**Fix**
Batch API calls or use a bulk endpoint to reduce network overhead.

**Confidence**
likely

**Code Evidence**
```
Detected 4 API call sites in this file
```

---

#### [MISSING_MEMO_19] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\orders\page.jsx:19

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchOrders = async () => {
```

---

#### [CACHE_OPPORTUNITY_22] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\admin\orders\page.jsx:22

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch("/api/orders");
```

---

#### [MISSING_MEMO_20] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\homepage\page.jsx:20

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchProducts = async () => {
```

---

#### [CACHE_OPPORTUNITY_23] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\admin\homepage\page.jsx:23

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch('/api/products');
```

---

#### [MISSING_MEMO_13] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\payments\page.jsx:13

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchPaymentStats = async () => {
```

---

#### [MISSING_MEMO_23] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\banners\page.jsx:23

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const res = await fetch('/api/products/types');
```

---

#### [CACHE_OPPORTUNITY_23] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\admin\banners\page.jsx:23

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const res = await fetch('/api/products/types');
```

---

#### [REPEATED_COMPUTATION_172] Expensive computation inside loop

- Category: logic
- Severity: medium
- File: src\app\api\products\generate-ai\route.js:172

**Description**
Repeated heavy utility call detected within an iterative loop body.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
JSON.stringify in loop
```

---

#### [REPEATED_COMPUTATION_215] Expensive computation inside loop

- Category: logic
- Severity: medium
- File: src\app\api\products\generate-ai\route.js:215

**Description**
Repeated heavy utility call detected within an iterative loop body.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
JSON.stringify in loop
```

---

#### [EVENT_LOOP_BLOCKING_281] Heavy JSON parsing may block event loop

- Category: logic
- Severity: medium
- File: src\app\api\products\generate-ai\route.js:281

**Description**
File size is large and synchronous JSON parsing appears in code path.

**Impact**
[object Object]

**Fix**
Move large JSON parsing to background worker or chunk processing.

**Confidence**
likely

**Code Evidence**
```
JSON.parse on potentially large input
```

---

#### [MISSING_MEMO_22] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\(public)\return-replacement\page.jsx:22

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const searchParams = useSearchParams();
```

---

#### [CACHE_OPPORTUNITY_52] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\(public)\return-replacement\page.jsx:52

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
fetch(`/api/orders/${orderId}`)
```

---

#### [MISSING_MEMO_20] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\(public)\order-cancellation\page.jsx:20

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const searchParams = useSearchParams();
```

---

#### [CACHE_OPPORTUNITY_37] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\(public)\order-cancellation\page.jsx:37

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
fetch(`/api/orders/${orderId}`)
```

---

#### [API_CALL_BURST_99] Multiple API calls detected

- Category: logic
- Severity: medium
- File: src\app\(public)\profile\page.jsx:99

**Description**
High count of outbound API invocations suggests batching opportunity.

**Impact**
[object Object]

**Fix**
Batch API calls or use a bulk endpoint to reduce network overhead.

**Confidence**
likely

**Code Evidence**
```
Detected 4 API call sites in this file
```

---

#### [MISSING_MEMO_30] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\(public)\profile\page.jsx:30

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const Alert = ({ type, message, onClose }) => {
```

---

#### [CACHE_OPPORTUNITY_99] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\(public)\profile\page.jsx:99

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const res = await fetch(`/api/user/${encodeURIComponent(user.email)}`, {
```

---

#### [MISSING_MEMO_11] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\(public)\order-confirmation\page.jsx:11

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const searchParams = useSearchParams();
```

---

#### [MISSING_MEMO_12] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\(public)\cart\page.jsx:12

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [API_CALL_BURST_51] Multiple API calls detected

- Category: logic
- Severity: medium
- File: src\app\(public)\check-out\page.jsx:51

**Description**
High count of outbound API invocations suggests batching opportunity.

**Impact**
[object Object]

**Fix**
Batch API calls or use a bulk endpoint to reduce network overhead.

**Confidence**
likely

**Code Evidence**
```
Detected 4 API call sites in this file
```

---

#### [MISSING_MEMO_60] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\(public)\check-out\page.jsx:60

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const data = await res.json();
```

---

#### [CACHE_OPPORTUNITY_51] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\(public)\check-out\page.jsx:51

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
return fetch(`/api/user/${encodeURIComponent(user.email)}`, {
```

---

#### [REPEATED_COMPUTATION_71] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\route.js:71

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
order.shippedAt = new Date();
```

---

#### [REPEATED_COMPUTATION_74] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\route.js:74

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
order.deliveredAt = new Date();
```

---

#### [REPEATED_COMPUTATION_84] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\route.js:84

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
order.updatedAt = new Date();
```

---

#### [REPEATED_COMPUTATION_60] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\update-banner\route.js:60

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
updatedAt: new Date(),
```

---

#### [MISSING_MEMO_20] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\(public)\contact-us\ContactPageClient.jsx:20

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchUserProfile = async () => {
```

---

#### [CACHE_OPPORTUNITY_24] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\(public)\contact-us\ContactPageClient.jsx:24

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const res = await fetch(`/api/user/${encodeURIComponent(user.email)}`, {
```

---

#### [REPEATED_COMPUTATION_195] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\export-products\route.js:195

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const filename = `google-shopping-feed-${new Date().toISOString().split('T')[0]}.xlsx`;
```

---

#### [REPEATED_COMPUTATION_35] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\analytics\pageview\route.js:35

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
timestamp: new Date()
```

---

#### [REPEATED_COMPUTATION_56] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\analytics\pageview\route.js:56

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const startDate = new Date();
```

---

#### [REPEATED_COMPUTATION_74] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\homepage-settings\route.js:74

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
updatedAt: new Date()
```

---

#### [MISSING_MEMO_8] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\orders\shipped\page.jsx:8

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [MISSING_MEMO_8] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\orders\returns\page.jsx:8

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [MISSING_MEMO_15] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\payments\transactions\page.jsx:15

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchTransactions = async () => {
```

---

#### [MISSING_MEMO_9] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\orders\pending\page.jsx:9

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [CACHE_OPPORTUNITY_21] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\admin\orders\pending\page.jsx:21

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch("/api/orders");
```

---

#### [REPEATED_COMPUTATION_23] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\save-banner-set\route.js:23

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
updatedAt: new Date(),
```

---

#### [MISSING_MEMO_14] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\payments\refunds\page.jsx:14

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const fetchRefunds = async () => {
```

---

#### [MISSING_MEMO_8] Potential missing memoization for derived values

- Category: ui
- Severity: medium
- File: src\app\admin\products\[title]\page.jsx:8

**Description**
React effect and local derived assignments detected without useMemo/useCallback guards.

**Impact**
[object Object]

**Fix**
Memoize derived computations with useMemo/useCallback when dependencies are stable.

**Confidence**
likely

**Code Evidence**
```
const router = useRouter();
```

---

#### [CACHE_OPPORTUNITY_32] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\admin\products\[title]\page.jsx:32

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch('/api/products');
```

---

#### [REPEATED_COMPUTATION_41] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\return\route.js:41

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const daysSinceDelivery = (Date.now() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24);
```

---

#### [REPEATED_COMPUTATION_49] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\return\route.js:49

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
order.returnRequestedAt = new Date();
```

---

#### [CACHE_OPPORTUNITY_46] Cache opportunity for repeated external calls

- Category: logic
- Severity: medium
- File: src\app\admin\products\inventory\page.jsx:46

**Description**
Multiple outbound calls were detected without visible cache/memoization layer.

**Impact**
[object Object]

**Fix**
Add request-level caching (HTTP cache, memoization, or Redis) for repeated external calls.

**Confidence**
likely

**Code Evidence**
```
const response = await fetch("/api/admin/products", {
```

---

#### [REPEATED_COMPUTATION_37] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\confirm\route.js:37

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
order.confirmedAt = new Date();
```

---

#### [REPEATED_COMPUTATION_41] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\replace\route.js:41

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const daysSinceDelivery = (Date.now() - new Date(deliveryDate).getTime()) / (1000 * 60 * 60 * 24);
```

---

#### [REPEATED_COMPUTATION_49] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\replace\route.js:49

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
order.replacementRequestedAt = new Date();
```

---

#### [REPEATED_COMPUTATION_11] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:11

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const now = new Date();
```

---

#### [REPEATED_COMPUTATION_12] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:12

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
```

---

#### [REPEATED_COMPUTATION_13] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:13

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
```

---

#### [REPEATED_COMPUTATION_14] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:14

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const startOfYear = new Date(now.getFullYear(), 0, 1);
```

---

#### [REPEATED_COMPUTATION_15] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:15

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
```

---

#### [REPEATED_COMPUTATION_29] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:29

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
.filter(o => new Date(o.createdAt) >= startOfDay && shouldCountInRevenue(o))
```

---

#### [REPEATED_COMPUTATION_33] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:33

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
.filter(o => new Date(o.createdAt) >= startOfMonth && shouldCountInRevenue(o))
```

---

#### [REPEATED_COMPUTATION_37] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:37

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
.filter(o => new Date(o.createdAt) >= startOfYear && shouldCountInRevenue(o))
```

---

#### [REPEATED_COMPUTATION_41] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:41

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const previousDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
```

---

#### [REPEATED_COMPUTATION_42] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:42

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const previousDayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate());
```

---

#### [REPEATED_COMPUTATION_45] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:45

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const orderDate = new Date(o.createdAt);
```

---

#### [REPEATED_COMPUTATION_55] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:55

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
```

---

#### [REPEATED_COMPUTATION_56] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:56

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
```

---

#### [REPEATED_COMPUTATION_69] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:69

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const previousYearStart = new Date(now.getFullYear() - 1, 0, 1);
```

---

#### [REPEATED_COMPUTATION_70] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:70

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const previousYearEnd = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
```

---

#### [REPEATED_COMPUTATION_102] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:102

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
u => new Date(u.createdAt) >= startOfMonth
```

---

#### [REPEATED_COMPUTATION_125] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\dashboard\stats\route.js:125

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
o => new Date(o.createdAt) >= last30Days
```

---

#### [REPEATED_COMPUTATION_44] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\cancel\route.js:44

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const orderAge = Date.now() - new Date(order.createdAt).getTime();
```

---

#### [REPEATED_COMPUTATION_70] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\orders\[id]\cancel\route.js:70

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
order.cancelledAt = new Date();
```

---

#### [REPEATED_COMPUTATION_9] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\analytics\traffic\route.js:9

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const now = new Date();
```

---

#### [REPEATED_COMPUTATION_10] Expensive computation inside loop

- Category: performance
- Severity: medium
- File: src\app\api\admin\analytics\traffic\route.js:10

**Description**
Repeated calculations degrade performance.

**Impact**
[object Object]

**Fix**
Move heavy computations outside loops or cache results.

**Confidence**
likely

**Code Evidence**
```
const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
```

---

#### [FINDING_1775803667568_9avvae] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\ToastContainer.jsx:N/A

**Description**
Detected UI blocks in src\components\ToastContainer.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_ts2a5v] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Toast.jsx:N/A

**Description**
Detected UI blocks in src\components\Toast.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_o0r4vq] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\app\not-found.jsx:N/A

**Description**
Detected UI blocks in src\app\not-found.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_5b7jd9] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\TestimonialsCarousel.jsx:N/A

**Description**
Detected UI blocks in src\components\TestimonialsCarousel.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_r5se4e] UI skeleton opportunity detected (grid layout)

- Category: ui
- Severity: medium
- File: src\components\SerpPreview.jsx:N/A

**Description**
Detected UI blocks in src\components\SerpPreview.jsx with grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_bgufeq] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\UserRoute.jsx:N/A

**Description**
Detected UI blocks in src\components\UserRoute.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_jwznv9] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Review.jsx:N/A

**Description**
Detected UI blocks in src\components\Review.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_zse6pi] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\ReviewForm.jsx:N/A

**Description**
Detected UI blocks in src\components\ReviewForm.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_1xsrix] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\Providers.jsx:N/A

**Description**
Detected UI blocks in src\components\Providers.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_0ad3c5] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\ProductTypeBanners.jsx:N/A

**Description**
Detected UI blocks in src\components\ProductTypeBanners.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_55uaa7] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\PublicRoute.jsx:N/A

**Description**
Detected UI blocks in src\components\PublicRoute.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_wtwbdi] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\ProductReviews.jsx:N/A

**Description**
Detected UI blocks in src\components\ProductReviews.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_6jn3br] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\PlaceholderImage.jsx:N/A

**Description**
Detected UI blocks in src\components\PlaceholderImage.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_m69h2g] UI skeleton opportunity detected (grid layout)

- Category: ui
- Severity: medium
- File: src\components\footer.jsx:N/A

**Description**
Detected UI blocks in src\components\footer.jsx with grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_a3r6i3] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\PrivateRoute.jsx:N/A

**Description**
Detected UI blocks in src\components\PrivateRoute.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_zrjhv4] UI skeleton opportunity detected (grid layout)

- Category: ui
- Severity: medium
- File: src\components\HeroSlider.jsx:N/A

**Description**
Detected UI blocks in src\components\HeroSlider.jsx with grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_bf14zx] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\ProductSlider.jsx:N/A

**Description**
Detected UI blocks in src\components\ProductSlider.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_atchdr] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\CollectionSection.jsx:N/A

**Description**
Detected UI blocks in src\components\CollectionSection.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_cqjwic] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Navbar.jsx:N/A

**Description**
Detected UI blocks in src\components\Navbar.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_kn1f46] UI skeleton opportunity detected (grid layout)

- Category: ui
- Severity: medium
- File: src\components\CompanyIntro.jsx:N/A

**Description**
Detected UI blocks in src\components\CompanyIntro.jsx with grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_705z6y] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\BestCollection1.jsx:N/A

**Description**
Detected UI blocks in src\components\BestCollection1.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_9xjjer] UI skeleton opportunity detected (grid layout)

- Category: ui
- Severity: medium
- File: src\components\BrandShowcase.jsx:N/A

**Description**
Detected UI blocks in src\components\BrandShowcase.jsx with grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_ikj8t0] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\AmazonSearchInput.jsx:N/A

**Description**
Detected UI blocks in src\components\AmazonSearchInput.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_8m1ytc] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\BannerUpload.jsx:N/A

**Description**
Detected UI blocks in src\components\BannerUpload.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_ph2qq4] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\BannerSlot.jsx:N/A

**Description**
Detected UI blocks in src\components\BannerSlot.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_cpfmlw] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\BannerStack.jsx:N/A

**Description**
Detected UI blocks in src\components\BannerStack.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_qfdt4p] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\FeaturedProductsSwitcherWrapper.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\FeaturedProductsSwitcherWrapper.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_yc5hxp] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Admin\ProtectedRoute.jsx:N/A

**Description**
Detected UI blocks in src\components\Admin\ProtectedRoute.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_um6t7v] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Admin\AdminSidebar.jsx:N/A

**Description**
Detected UI blocks in src\components\Admin\AdminSidebar.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_shul3e] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Admin\ModernDashboard.jsx:N/A

**Description**
Detected UI blocks in src\components\Admin\ModernDashboard.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_4whj0j] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Admin\ProductTable.jsx:N/A

**Description**
Detected UI blocks in src\components\Admin\ProductTable.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_tmvqjb] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Admin\DashboardStats.jsx:N/A

**Description**
Detected UI blocks in src\components\Admin\DashboardStats.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_pawqr6] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Card\ProductCard.jsx:N/A

**Description**
Detected UI blocks in src\components\Card\ProductCard.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_kp90qr] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\Admin\AdminHeader.jsx:N/A

**Description**
Detected UI blocks in src\components\Admin\AdminHeader.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_h8vqtx] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Admin\EditProductForm.jsx:N/A

**Description**
Detected UI blocks in src\components\Admin\EditProductForm.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_w3xkgx] UI skeleton opportunity detected (grid layout)

- Category: ui
- Severity: medium
- File: src\components\Card\NotifyForm.jsx:N/A

**Description**
Detected UI blocks in src\components\Card\NotifyForm.jsx with grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_zarmlh] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Admin\AddProductForm.jsx:N/A

**Description**
Detected UI blocks in src\components\Admin\AddProductForm.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_jdfx6s] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Card\Enquiry.jsx:N/A

**Description**
Detected UI blocks in src\components\Card\Enquiry.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_0grned] UI skeleton opportunity detected (grid layout)

- Category: ui
- Severity: medium
- File: src\components\Card\Funtion.jsx:N/A

**Description**
Detected UI blocks in src\components\Card\Funtion.jsx with grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_g2b8q9] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\components\Card\CollectionCard.jsx:N/A

**Description**
Detected UI blocks in src\components\Card\CollectionCard.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_aarjeg] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\components\Card\FeatureCard.jsx:N/A

**Description**
Detected UI blocks in src\components\Card\FeatureCard.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_xy07lk] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\products\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\products\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_ucydhn] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\orders\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\orders\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_5re3k7] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\homepage\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\homepage\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_3vowki] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\payments\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\payments\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_i5xs0p] UI skeleton opportunity detected (grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\banners\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\banners\page.jsx with grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_5ckhtx] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\return-replacement\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\return-replacement\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_ccr5hx] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\order-cancellation\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\order-cancellation\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_6cfcyx] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\profile\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\profile\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_wi44b9] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\wishlist\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\wishlist\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_ednttd] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\order-confirmation\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\order-confirmation\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_s98nzj] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\cart\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\cart\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_c6h8j3] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\check-out\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\check-out\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_xjkdmd] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\about\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\about\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_pzyeal] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\login\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\login\page.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_kw1izv] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\contact-us\ContactPageClient.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\contact-us\ContactPageClient.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_1smpaq] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\orders\shipped\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\orders\shipped\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_szdw0i] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\orders\returns\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\orders\returns\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_vu7i9r] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\payments\transactions\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\payments\transactions\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_73jk5p] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\orders\pending\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\orders\pending\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_ttvw4s] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\policy\terms-and-condition\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\policy\terms-and-condition\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_6h69e5] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\policy\shipping-policy\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\policy\shipping-policy\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_lp13bv] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\policy\cancellationrefundpage\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\policy\cancellationrefundpage\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_7htux1] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\policy\privacy-policy\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\policy\privacy-policy\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_m7ydr6] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\payments\refunds\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\payments\refunds\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_d27x4l] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\products\[title]\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\products\[title]\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_kn2d0t] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\admin\products\inventory\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\products\inventory\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_8g1xfl] UI skeleton opportunity detected (simple layout)

- Category: ui
- Severity: medium
- File: src\app\admin\products\add\page.jsx:N/A

**Description**
Detected UI blocks in src\app\admin\products\add\page.jsx with simple structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

#### [FINDING_1775803667569_62jp5s] UI skeleton opportunity detected (complex-grid layout)

- Category: ui
- Severity: medium
- File: src\app\(public)\all-products\[type]\page.jsx:N/A

**Description**
Detected UI blocks in src\app\(public)\all-products\[type]\page.jsx with complex-grid structure.

**Impact**
Users may experience poor perceived performance during loading states.

**Fix**
Optional enhancement for better UX.

**Confidence**
likely

---

## Remediation Summary

### Immediate (Critical)
- [INFINITE_LOOP_83] Infinite loop detected (src\app\api\admin\products\[id]\route.js:83)

### High Priority
- [XSS_DOM_136] DOM-based XSS Risk (src\app\layout.js:136)
- [XSS_DOM_157] DOM-based XSS Risk (src\app\layout.js:157)
- [XSS_DOM_173] DOM-based XSS Risk (src\app\layout.js:173)
- [XSS_DOM_150] DOM-based XSS Risk (src\components\BrandShowcase.jsx:150)
- [SQL_INJECTION_373] Potential SQL Injection (src\components\Admin\EditProductForm.jsx:373)
- [INFINITE_LOOP_RISK_83] Potential infinite loop (src\app\api\admin\products\[id]\route.js:83)
- [N_PLUS_ONE_QUERY_5] Possible N+1 query pattern (src\app\api\products\upload-image\route.js:5)
- [N_PLUS_ONE_QUERY_20] Possible N+1 query pattern (src\app\api\admin\update-banner\route.js:20)
- [FINDING_1775803667569_oexj8f] UI skeleton opportunity detected (complex-grid layout) (src\components\ProductSection.jsx:N/A)
- [FINDING_1775803667569_avs1nf] UI skeleton opportunity detected (complex-grid layout) (src\components\FeaturedProductsSwitcher.jsx:N/A)
- [FINDING_1775803667569_6v87f2] UI skeleton opportunity detected (complex-grid layout) (src\components\FeaturedProduct.jsx:N/A)
- [FINDING_1775803667569_krz161] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\all-products\page.jsx:N/A)
- [FINDING_1775803667569_jb1jac] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\all-products\[type]\[title]\page.jsx:N/A)

### Optimization
- [INSECURE_RANDOM_63] Insecure Random Generator (src\utils\avatarHelpers.js:63)
- [INSECURE_RANDOM_75] Insecure Random Generator (src\utils\avatarHelpers.js:75)
- [INSECURE_RANDOM_12] Insecure Random Generator (src\components\ToastContainer.jsx:12)
- [INSECURE_RANDOM_121] Insecure Random Generator (src\app\admin\products\page.jsx:121)
- [INSECURE_RANDOM_122] Insecure Random Generator (src\app\admin\products\page.jsx:122)
- [INSECURE_RANDOM_383] Insecure Random Generator (src\app\api\products\generate-ai\route.js:383)
- [INSECURE_RANDOM_91] Insecure Random Generator (src\app\api\admin\export-products\route.js:91)
- [DIRECT_OBJECT_REFERENCE_19] Direct object reference without validation (src\components\AmazonSearchInput.jsx:19)
- [REPEATED_COMPUTATION_10] Expensive computation inside loop (src\lib\roleHelpers.js:10)
- [REPEATED_COMPUTATION_256] Expensive computation inside loop (src\lib\emailService.js:256)
- [REPEATED_COMPUTATION_452] Expensive computation inside loop (src\lib\emailService.js:452)
- [REPEATED_COMPUTATION_567] Expensive computation inside loop (src\lib\emailService.js:567)
- [REPEATED_COMPUTATION_647] Expensive computation inside loop (src\lib\emailService.js:647)
- [REPEATED_COMPUTATION_735] Expensive computation inside loop (src\lib\emailService.js:735)
- [REPEATED_COMPUTATION_48] Expensive computation inside loop (src\utils\helpers.js:48)
- [REPEATED_COMPUTATION_73] Expensive computation inside loop (src\utils\avatarHelpers.js:73)
- [REPEATED_COMPUTATION_74] Expensive computation inside loop (src\utils\avatarHelpers.js:74)
- [REPEATED_COMPUTATION_76] Expensive computation inside loop (src\utils\avatarHelpers.js:76)
- [REPEATED_COMPUTATION_141] Expensive computation inside loop (src\utils\avatarHelpers.js:141)
- [MISSING_MEMO_12] Potential missing memoization for derived values (src\hooks\useAdminAuth.js:12)
- [MISSING_MEMO_4] Potential missing memoization for derived values (src\context\CartContext.js:4)
- [MISSING_MEMO_7] Potential missing memoization for derived values (src\context\AuthContext.js:7)
- [MISSING_MEMO_6] Potential missing memoization for derived values (src\context\WishlistContext.js:6)
- [MISSING_MEMO_13] Potential missing memoization for derived values (src\components\Toast.jsx:13)
- [MISSING_MEMO_14] Potential missing memoization for derived values (src\components\TestimonialsCarousel.jsx:14)
- [MISSING_MEMO_9] Potential missing memoization for derived values (src\components\UserRoute.jsx:9)
- [REPEATED_COMPUTATION_35] Expensive computation inside loop (src\app\sitemap.js:35)
- [REPEATED_COMPUTATION_133] Expensive computation inside loop (src\app\sitemap.js:133)
- [REPEATED_COMPUTATION_140] Expensive computation inside loop (src\app\layout.js:140)
- [MISSING_MEMO_7] Potential missing memoization for derived values (src\components\Review.jsx:7)
- [MISSING_MEMO_16] Potential missing memoization for derived values (src\components\ProductSchema.jsx:16)
- [MISSING_MEMO_14] Potential missing memoization for derived values (src\components\ProductTypeBanners.jsx:14)
- [CACHE_OPPORTUNITY_14] Cache opportunity for repeated external calls (src\components\ProductTypeBanners.jsx:14)
- [MISSING_MEMO_9] Potential missing memoization for derived values (src\components\PublicRoute.jsx:9)
- [MISSING_MEMO_19] Potential missing memoization for derived values (src\components\ProductReviews.jsx:19)
- [CACHE_OPPORTUNITY_32] Cache opportunity for repeated external calls (src\components\ProductReviews.jsx:32)
- [API_CALL_BURST_30] Multiple API calls detected (src\components\OrderHistory.js:30)
- [MISSING_MEMO_23] Potential missing memoization for derived values (src\components\OrderHistory.js:23)
- [CACHE_OPPORTUNITY_30] Cache opportunity for repeated external calls (src\components\OrderHistory.js:30)
- [MISSING_MEMO_9] Potential missing memoization for derived values (src\components\PrivateRoute.jsx:9)
- [MISSING_MEMO_7] Potential missing memoization for derived values (src\components\HeroSlider.jsx:7)
- [CACHE_OPPORTUNITY_76] Cache opportunity for repeated external calls (src\components\ProductSlider.jsx:76)
- [MISSING_MEMO_11] Potential missing memoization for derived values (src\components\CollectionSection.jsx:11)
- [MISSING_MEMO_15] Potential missing memoization for derived values (src\components\BreadcrumbSchema.jsx:15)
- [MISSING_MEMO_17] Potential missing memoization for derived values (src\components\Navbar.jsx:17)
- [CACHE_OPPORTUNITY_32] Cache opportunity for repeated external calls (src\components\BestCollection1.jsx:32)
- [EVENT_LOOP_BLOCKING_49] Heavy JSON parsing may block event loop (src\components\AmazonSearchInput.jsx:49)
- [MISSING_MEMO_41] Potential missing memoization for derived values (src\components\AmazonSearchInput.jsx:41)
- [REPEATED_COMPUTATION_33] Expensive computation inside loop (src\app\api\test-email\route.js:33)
- [REPEATED_COMPUTATION_34] Expensive computation inside loop (src\app\api\test-email\route.js:34)
- [MISSING_MEMO_14] Potential missing memoization for derived values (src\app\(public)\FeaturedProductsSwitcherWrapper.jsx:14)
- [MISSING_MEMO_15] Potential missing memoization for derived values (src\components\Admin\ProtectedRoute.jsx:15)
- [API_CALL_BURST_60] Multiple API calls detected (src\components\Admin\ModernDashboard.jsx:60)
- [MISSING_MEMO_56] Potential missing memoization for derived values (src\components\Admin\ModernDashboard.jsx:56)
- [CACHE_OPPORTUNITY_60] Cache opportunity for repeated external calls (src\components\Admin\ModernDashboard.jsx:60)
- [MISSING_MEMO_58] Potential missing memoization for derived values (src\components\Admin\DashboardStats.jsx:58)
- [CACHE_OPPORTUNITY_61] Cache opportunity for repeated external calls (src\components\Admin\DashboardStats.jsx:61)
- [API_CALL_BURST_75] Multiple API calls detected (src\components\Admin\EditProductForm.jsx:75)
- [MISSING_MEMO_53] Potential missing memoization for derived values (src\components\Admin\EditProductForm.jsx:53)
- [CACHE_OPPORTUNITY_75] Cache opportunity for repeated external calls (src\components\Admin\EditProductForm.jsx:75)
- [API_CALL_BURST_78] Multiple API calls detected (src\components\Admin\AddProductForm.jsx:78)
- [MISSING_MEMO_56] Potential missing memoization for derived values (src\components\Admin\AddProductForm.jsx:56)
- [CACHE_OPPORTUNITY_78] Cache opportunity for repeated external calls (src\components\Admin\AddProductForm.jsx:78)
- [MISSING_MEMO_22] Potential missing memoization for derived values (src\components\Card\Enquiry.jsx:22)
- [CACHE_OPPORTUNITY_26] Cache opportunity for repeated external calls (src\components\Card\Enquiry.jsx:26)
- [REPEATED_COMPUTATION_66] Expensive computation inside loop (src\app\api\contact\route.js:66)
- [REPEATED_COMPUTATION_273] Expensive computation inside loop (src\app\api\contact\route.js:273)
- [REPEATED_COMPUTATION_287] Expensive computation inside loop (src\app\api\contact\route.js:287)
- [REPEATED_COMPUTATION_47] Expensive computation inside loop (src\app\api\notifications\route.js:47)
- [MISSING_MEMO_19] Potential missing memoization for derived values (src\app\admin\users\page.js:19)
- [API_CALL_BURST_52] Multiple API calls detected (src\app\admin\products\page.jsx:52)
- [MISSING_MEMO_15] Potential missing memoization for derived values (src\app\admin\products\page.jsx:15)
- [CACHE_OPPORTUNITY_52] Cache opportunity for repeated external calls (src\app\admin\products\page.jsx:52)
- [API_CALL_BURST_22] Multiple API calls detected (src\app\admin\orders\page.jsx:22)
- [MISSING_MEMO_19] Potential missing memoization for derived values (src\app\admin\orders\page.jsx:19)
- [CACHE_OPPORTUNITY_22] Cache opportunity for repeated external calls (src\app\admin\orders\page.jsx:22)
- [MISSING_MEMO_20] Potential missing memoization for derived values (src\app\admin\homepage\page.jsx:20)
- [CACHE_OPPORTUNITY_23] Cache opportunity for repeated external calls (src\app\admin\homepage\page.jsx:23)
- [MISSING_MEMO_13] Potential missing memoization for derived values (src\app\admin\payments\page.jsx:13)
- [MISSING_MEMO_23] Potential missing memoization for derived values (src\app\admin\banners\page.jsx:23)
- [CACHE_OPPORTUNITY_23] Cache opportunity for repeated external calls (src\app\admin\banners\page.jsx:23)
- [REPEATED_COMPUTATION_172] Expensive computation inside loop (src\app\api\products\generate-ai\route.js:172)
- [REPEATED_COMPUTATION_215] Expensive computation inside loop (src\app\api\products\generate-ai\route.js:215)
- [EVENT_LOOP_BLOCKING_281] Heavy JSON parsing may block event loop (src\app\api\products\generate-ai\route.js:281)
- [MISSING_MEMO_22] Potential missing memoization for derived values (src\app\(public)\return-replacement\page.jsx:22)
- [CACHE_OPPORTUNITY_52] Cache opportunity for repeated external calls (src\app\(public)\return-replacement\page.jsx:52)
- [MISSING_MEMO_20] Potential missing memoization for derived values (src\app\(public)\order-cancellation\page.jsx:20)
- [CACHE_OPPORTUNITY_37] Cache opportunity for repeated external calls (src\app\(public)\order-cancellation\page.jsx:37)
- [API_CALL_BURST_99] Multiple API calls detected (src\app\(public)\profile\page.jsx:99)
- [MISSING_MEMO_30] Potential missing memoization for derived values (src\app\(public)\profile\page.jsx:30)
- [CACHE_OPPORTUNITY_99] Cache opportunity for repeated external calls (src\app\(public)\profile\page.jsx:99)
- [MISSING_MEMO_11] Potential missing memoization for derived values (src\app\(public)\order-confirmation\page.jsx:11)
- [MISSING_MEMO_12] Potential missing memoization for derived values (src\app\(public)\cart\page.jsx:12)
- [API_CALL_BURST_51] Multiple API calls detected (src\app\(public)\check-out\page.jsx:51)
- [MISSING_MEMO_60] Potential missing memoization for derived values (src\app\(public)\check-out\page.jsx:60)
- [CACHE_OPPORTUNITY_51] Cache opportunity for repeated external calls (src\app\(public)\check-out\page.jsx:51)
- [REPEATED_COMPUTATION_71] Expensive computation inside loop (src\app\api\orders\[id]\route.js:71)
- [REPEATED_COMPUTATION_74] Expensive computation inside loop (src\app\api\orders\[id]\route.js:74)
- [REPEATED_COMPUTATION_84] Expensive computation inside loop (src\app\api\orders\[id]\route.js:84)
- [REPEATED_COMPUTATION_60] Expensive computation inside loop (src\app\api\admin\update-banner\route.js:60)
- [MISSING_MEMO_20] Potential missing memoization for derived values (src\app\(public)\contact-us\ContactPageClient.jsx:20)
- [CACHE_OPPORTUNITY_24] Cache opportunity for repeated external calls (src\app\(public)\contact-us\ContactPageClient.jsx:24)
- [REPEATED_COMPUTATION_195] Expensive computation inside loop (src\app\api\admin\export-products\route.js:195)
- [REPEATED_COMPUTATION_35] Expensive computation inside loop (src\app\api\analytics\pageview\route.js:35)
- [REPEATED_COMPUTATION_56] Expensive computation inside loop (src\app\api\analytics\pageview\route.js:56)
- [REPEATED_COMPUTATION_74] Expensive computation inside loop (src\app\api\admin\homepage-settings\route.js:74)
- [MISSING_MEMO_8] Potential missing memoization for derived values (src\app\admin\orders\shipped\page.jsx:8)
- [MISSING_MEMO_8] Potential missing memoization for derived values (src\app\admin\orders\returns\page.jsx:8)
- [MISSING_MEMO_15] Potential missing memoization for derived values (src\app\admin\payments\transactions\page.jsx:15)
- [MISSING_MEMO_9] Potential missing memoization for derived values (src\app\admin\orders\pending\page.jsx:9)
- [CACHE_OPPORTUNITY_21] Cache opportunity for repeated external calls (src\app\admin\orders\pending\page.jsx:21)
- [REPEATED_COMPUTATION_23] Expensive computation inside loop (src\app\api\admin\save-banner-set\route.js:23)
- [MISSING_MEMO_14] Potential missing memoization for derived values (src\app\admin\payments\refunds\page.jsx:14)
- [MISSING_MEMO_8] Potential missing memoization for derived values (src\app\admin\products\[title]\page.jsx:8)
- [CACHE_OPPORTUNITY_32] Cache opportunity for repeated external calls (src\app\admin\products\[title]\page.jsx:32)
- [REPEATED_COMPUTATION_41] Expensive computation inside loop (src\app\api\orders\[id]\return\route.js:41)
- [REPEATED_COMPUTATION_49] Expensive computation inside loop (src\app\api\orders\[id]\return\route.js:49)
- [CACHE_OPPORTUNITY_46] Cache opportunity for repeated external calls (src\app\admin\products\inventory\page.jsx:46)
- [REPEATED_COMPUTATION_37] Expensive computation inside loop (src\app\api\orders\[id]\confirm\route.js:37)
- [REPEATED_COMPUTATION_41] Expensive computation inside loop (src\app\api\orders\[id]\replace\route.js:41)
- [REPEATED_COMPUTATION_49] Expensive computation inside loop (src\app\api\orders\[id]\replace\route.js:49)
- [REPEATED_COMPUTATION_11] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:11)
- [REPEATED_COMPUTATION_12] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:12)
- [REPEATED_COMPUTATION_13] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:13)
- [REPEATED_COMPUTATION_14] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:14)
- [REPEATED_COMPUTATION_15] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:15)
- [REPEATED_COMPUTATION_29] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:29)
- [REPEATED_COMPUTATION_33] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:33)
- [REPEATED_COMPUTATION_37] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:37)
- [REPEATED_COMPUTATION_41] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:41)
- [REPEATED_COMPUTATION_42] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:42)
- [REPEATED_COMPUTATION_45] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:45)
- [REPEATED_COMPUTATION_55] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:55)
- [REPEATED_COMPUTATION_56] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:56)
- [REPEATED_COMPUTATION_69] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:69)
- [REPEATED_COMPUTATION_70] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:70)
- [REPEATED_COMPUTATION_102] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:102)
- [REPEATED_COMPUTATION_125] Expensive computation inside loop (src\app\api\admin\dashboard\stats\route.js:125)
- [REPEATED_COMPUTATION_44] Expensive computation inside loop (src\app\api\orders\[id]\cancel\route.js:44)
- [REPEATED_COMPUTATION_70] Expensive computation inside loop (src\app\api\orders\[id]\cancel\route.js:70)
- [REPEATED_COMPUTATION_9] Expensive computation inside loop (src\app\api\admin\analytics\traffic\route.js:9)
- [REPEATED_COMPUTATION_10] Expensive computation inside loop (src\app\api\admin\analytics\traffic\route.js:10)
- [FINDING_1775803667568_9avvae] UI skeleton opportunity detected (simple layout) (src\components\ToastContainer.jsx:N/A)
- [FINDING_1775803667569_ts2a5v] UI skeleton opportunity detected (complex-grid layout) (src\components\Toast.jsx:N/A)
- [FINDING_1775803667569_o0r4vq] UI skeleton opportunity detected (simple layout) (src\app\not-found.jsx:N/A)
- [FINDING_1775803667569_5b7jd9] UI skeleton opportunity detected (complex-grid layout) (src\components\TestimonialsCarousel.jsx:N/A)
- [FINDING_1775803667569_r5se4e] UI skeleton opportunity detected (grid layout) (src\components\SerpPreview.jsx:N/A)
- [FINDING_1775803667569_bgufeq] UI skeleton opportunity detected (simple layout) (src\components\UserRoute.jsx:N/A)
- [FINDING_1775803667569_jwznv9] UI skeleton opportunity detected (complex-grid layout) (src\components\Review.jsx:N/A)
- [FINDING_1775803667569_zse6pi] UI skeleton opportunity detected (complex-grid layout) (src\components\ReviewForm.jsx:N/A)
- [FINDING_1775803667569_1xsrix] UI skeleton opportunity detected (simple layout) (src\components\Providers.jsx:N/A)
- [FINDING_1775803667569_0ad3c5] UI skeleton opportunity detected (simple layout) (src\components\ProductTypeBanners.jsx:N/A)
- [FINDING_1775803667569_55uaa7] UI skeleton opportunity detected (simple layout) (src\components\PublicRoute.jsx:N/A)
- [FINDING_1775803667569_wtwbdi] UI skeleton opportunity detected (complex-grid layout) (src\components\ProductReviews.jsx:N/A)
- [FINDING_1775803667569_6jn3br] UI skeleton opportunity detected (simple layout) (src\components\PlaceholderImage.jsx:N/A)
- [FINDING_1775803667569_m69h2g] UI skeleton opportunity detected (grid layout) (src\components\footer.jsx:N/A)
- [FINDING_1775803667569_a3r6i3] UI skeleton opportunity detected (simple layout) (src\components\PrivateRoute.jsx:N/A)
- [FINDING_1775803667569_zrjhv4] UI skeleton opportunity detected (grid layout) (src\components\HeroSlider.jsx:N/A)
- [FINDING_1775803667569_bf14zx] UI skeleton opportunity detected (complex-grid layout) (src\components\ProductSlider.jsx:N/A)
- [FINDING_1775803667569_atchdr] UI skeleton opportunity detected (simple layout) (src\components\CollectionSection.jsx:N/A)
- [FINDING_1775803667569_cqjwic] UI skeleton opportunity detected (complex-grid layout) (src\components\Navbar.jsx:N/A)
- [FINDING_1775803667569_kn1f46] UI skeleton opportunity detected (grid layout) (src\components\CompanyIntro.jsx:N/A)
- [FINDING_1775803667569_705z6y] UI skeleton opportunity detected (complex-grid layout) (src\components\BestCollection1.jsx:N/A)
- [FINDING_1775803667569_9xjjer] UI skeleton opportunity detected (grid layout) (src\components\BrandShowcase.jsx:N/A)
- [FINDING_1775803667569_ikj8t0] UI skeleton opportunity detected (complex-grid layout) (src\components\AmazonSearchInput.jsx:N/A)
- [FINDING_1775803667569_8m1ytc] UI skeleton opportunity detected (simple layout) (src\components\BannerUpload.jsx:N/A)
- [FINDING_1775803667569_ph2qq4] UI skeleton opportunity detected (simple layout) (src\components\BannerSlot.jsx:N/A)
- [FINDING_1775803667569_cpfmlw] UI skeleton opportunity detected (simple layout) (src\components\BannerStack.jsx:N/A)
- [FINDING_1775803667569_qfdt4p] UI skeleton opportunity detected (simple layout) (src\app\(public)\FeaturedProductsSwitcherWrapper.jsx:N/A)
- [FINDING_1775803667569_yc5hxp] UI skeleton opportunity detected (complex-grid layout) (src\components\Admin\ProtectedRoute.jsx:N/A)
- [FINDING_1775803667569_um6t7v] UI skeleton opportunity detected (complex-grid layout) (src\components\Admin\AdminSidebar.jsx:N/A)
- [FINDING_1775803667569_shul3e] UI skeleton opportunity detected (complex-grid layout) (src\components\Admin\ModernDashboard.jsx:N/A)
- [FINDING_1775803667569_4whj0j] UI skeleton opportunity detected (complex-grid layout) (src\components\Admin\ProductTable.jsx:N/A)
- [FINDING_1775803667569_tmvqjb] UI skeleton opportunity detected (complex-grid layout) (src\components\Admin\DashboardStats.jsx:N/A)
- [FINDING_1775803667569_pawqr6] UI skeleton opportunity detected (complex-grid layout) (src\components\Card\ProductCard.jsx:N/A)
- [FINDING_1775803667569_kp90qr] UI skeleton opportunity detected (simple layout) (src\components\Admin\AdminHeader.jsx:N/A)
- [FINDING_1775803667569_h8vqtx] UI skeleton opportunity detected (complex-grid layout) (src\components\Admin\EditProductForm.jsx:N/A)
- [FINDING_1775803667569_w3xkgx] UI skeleton opportunity detected (grid layout) (src\components\Card\NotifyForm.jsx:N/A)
- [FINDING_1775803667569_zarmlh] UI skeleton opportunity detected (complex-grid layout) (src\components\Admin\AddProductForm.jsx:N/A)
- [FINDING_1775803667569_jdfx6s] UI skeleton opportunity detected (complex-grid layout) (src\components\Card\Enquiry.jsx:N/A)
- [FINDING_1775803667569_0grned] UI skeleton opportunity detected (grid layout) (src\components\Card\Funtion.jsx:N/A)
- [FINDING_1775803667569_g2b8q9] UI skeleton opportunity detected (simple layout) (src\components\Card\CollectionCard.jsx:N/A)
- [FINDING_1775803667569_aarjeg] UI skeleton opportunity detected (complex-grid layout) (src\components\Card\FeatureCard.jsx:N/A)
- [FINDING_1775803667569_xy07lk] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\products\page.jsx:N/A)
- [FINDING_1775803667569_ucydhn] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\orders\page.jsx:N/A)
- [FINDING_1775803667569_5re3k7] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\homepage\page.jsx:N/A)
- [FINDING_1775803667569_3vowki] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\payments\page.jsx:N/A)
- [FINDING_1775803667569_i5xs0p] UI skeleton opportunity detected (grid layout) (src\app\admin\banners\page.jsx:N/A)
- [FINDING_1775803667569_5ckhtx] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\return-replacement\page.jsx:N/A)
- [FINDING_1775803667569_ccr5hx] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\order-cancellation\page.jsx:N/A)
- [FINDING_1775803667569_6cfcyx] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\profile\page.jsx:N/A)
- [FINDING_1775803667569_wi44b9] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\wishlist\page.jsx:N/A)
- [FINDING_1775803667569_ednttd] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\order-confirmation\page.jsx:N/A)
- [FINDING_1775803667569_s98nzj] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\cart\page.jsx:N/A)
- [FINDING_1775803667569_c6h8j3] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\check-out\page.jsx:N/A)
- [FINDING_1775803667569_xjkdmd] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\about\page.jsx:N/A)
- [FINDING_1775803667569_pzyeal] UI skeleton opportunity detected (simple layout) (src\app\(public)\login\page.jsx:N/A)
- [FINDING_1775803667569_kw1izv] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\contact-us\ContactPageClient.jsx:N/A)
- [FINDING_1775803667569_1smpaq] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\orders\shipped\page.jsx:N/A)
- [FINDING_1775803667569_szdw0i] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\orders\returns\page.jsx:N/A)
- [FINDING_1775803667569_vu7i9r] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\payments\transactions\page.jsx:N/A)
- [FINDING_1775803667569_73jk5p] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\orders\pending\page.jsx:N/A)
- [FINDING_1775803667569_ttvw4s] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\policy\terms-and-condition\page.jsx:N/A)
- [FINDING_1775803667569_6h69e5] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\policy\shipping-policy\page.jsx:N/A)
- [FINDING_1775803667569_lp13bv] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\policy\cancellationrefundpage\page.jsx:N/A)
- [FINDING_1775803667569_7htux1] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\policy\privacy-policy\page.jsx:N/A)
- [FINDING_1775803667569_m7ydr6] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\payments\refunds\page.jsx:N/A)
- [FINDING_1775803667569_d27x4l] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\products\[title]\page.jsx:N/A)
- [FINDING_1775803667569_kn2d0t] UI skeleton opportunity detected (complex-grid layout) (src\app\admin\products\inventory\page.jsx:N/A)
- [FINDING_1775803667569_8g1xfl] UI skeleton opportunity detected (simple layout) (src\app\admin\products\add\page.jsx:N/A)
- [FINDING_1775803667569_62jp5s] UI skeleton opportunity detected (complex-grid layout) (src\app\(public)\all-products\[type]\page.jsx:N/A)

## Final Verdict

- Critical Risk
