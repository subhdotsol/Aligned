/**
 * API Testing Script for Aligned Backend
 * 
 * Run with: node testing/api-test.js
 * Make sure the backend server is running on http://127.0.0.1:8080
 */

const BASE_URL = 'http://127.0.0.1:8080';

// Store token after authentication
let authToken = null;
let verificationId = null;

// Helper function to make API calls
async function apiCall(method, endpoint, body = null, requiresAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (requiresAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const text = await response.text();
        
        // Try to parse as JSON, fallback to text
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { text };  // Wrap plain text in object
        }
        
        return { status: response.status, data };
    } catch (error) {
        return { status: 'ERROR', error: error.message };
    }
}

// Helper to log results
function logResult(testName, result) {
    // Accept any 2xx status as success
    const isSuccess = typeof result.status === 'number' && result.status >= 200 && result.status < 300;
    const status = isSuccess ? '✅' : '❌';
    console.log(`\n${status} ${testName}`);
    console.log(`   Status: ${result.status}`);
    if (result.error) {
        console.log(`   Error: ${result.error}`);
    } else if (result.data) {
        const dataStr = JSON.stringify(result.data, null, 2);
        console.log(`   Response:`, dataStr.substring(0, 500));
    }
    return isSuccess;
}

// ============================================
// TEST FUNCTIONS
// ============================================

// 1. Health Check
async function testHealthCheck() {
    const result = await apiCall('GET', '/health');
    logResult('GET /health - Health Check', result);
    return result.status === 200;
}

// 2. Phone Login (Get Verification ID)
async function testPhoneLogin(phone = '+1234567890') {
    const result = await apiCall('POST', '/auth/phone/login', { phone });
    logResult('POST /auth/phone/login - Request OTP', result);
    
    if (result.data && result.data.verification_id) {
        verificationId = result.data.verification_id;
        console.log(`   📝 Saved verification_id: ${verificationId}`);
    }
    return result.status === 200;
}

// 3. Phone Verify (Get Auth Token)
async function testPhoneVerify(code = '123456') {
    if (!verificationId) {
        console.log('❌ No verification_id available. Run testPhoneLogin first.');
        return false;
    }
    
    const result = await apiCall('POST', '/auth/phone/verify', {
        verification_id: verificationId,
        code: code
    });
    logResult('POST /auth/phone/verify - Verify OTP & Get Token', result);
    
    if (result.data && result.data.token) {
        authToken = result.data.token;
        console.log(`   🔑 Saved auth token: ${authToken.substring(0, 50)}...`);
    }
    return result.status === 200;
}

// ============================================
// PROTECTED ROUTES (Require Auth Token)
// ============================================

// 4. Get Profile
async function testGetProfile() {
    const result = await apiCall('GET', '/profile/me', null, true);
    logResult('GET /profile/me - Get User Profile', result);
    return result.status === 200;
}

// 5. Update Profile
async function testUpdateProfile() {
    const result = await apiCall('POST', '/profile', {
        name: 'Test User',
        bio: 'Testing the API',
        gender: 'Man',
        sexuality: 'Straight',
        height: 180,
        job: 'Developer',
        ethnicity: 'Asian',
        politics: 'Moderate',
        religion: 'None',
        relationship_type: 'Monogamy',
        dating_intention: 'Long-term relationship',
        drinks: 'Socially',
        smokes: 'No'
    }, true);
    logResult('POST /profile - Update Profile', result);
    return result.status === 200;
}

// 6. Update User Preferences
async function testUpdatePreferences() {
    const result = await apiCall('POST', '/user/preferences', {
        age_range: { min: 21, max: 35 },
        distance_max: 50,
        gender_preference: ['Woman'],
        ethnicity_preference: [],
        religion_preference: []
    }, true);
    logResult('POST /user/preferences - Update Preferences', result);
    return result.status === 200;
}

// 7. Get Feed
async function testGetFeed() {
    const result = await apiCall('GET', '/feed', null, true);
    logResult('GET /feed - Get Feed Suggestions', result);
    
    // Show additional feed details
    if (result.data && result.data.profiles) {
        console.log(`   📊 Found ${result.data.profiles.length} profiles:`);
        result.data.profiles.forEach((p, i) => {
            const name = p.details?.name || 'Unknown';
            const gender = p.details?.gender || 'Unknown';
            const job = p.details?.job || 'Unknown';
            console.log(`      ${i+1}. ${name} (${gender}) - ${job}`);
        });
    }
    
    return result.status === 200;
}

// 8. Get Prompts
async function testGetPrompts() {
    const result = await apiCall('GET', '/prompts', null, true);
    logResult('GET /prompts - Get User Prompts', result);
    return result.status === 200;
}

// 9. Create Prompt
async function testCreatePrompt() {
    const result = await apiCall('POST', '/prompts', {
        question: 'What is your favorite hobby?',
        answer: 'I love coding and hiking!'
    }, true);
    logResult('POST /prompts - Create Prompt', result);
    return result.status === 200;
}

// 10. Update Prompt
async function testUpdatePrompt(order = 0) {
    const result = await apiCall('PUT', `/prompts/${order}`, {
        question: 'What is your favorite hobby?',
        answer: 'Updated: I love coding, hiking, and coffee!'
    }, true);
    logResult(`PUT /prompts/${order} - Update Prompt`, result);
    return result.status === 200;
}

// 11. Delete Prompt
async function testDeletePrompt(order = 0) {
    const result = await apiCall('DELETE', `/prompts/${order}`, null, true);
    logResult(`DELETE /prompts/${order} - Delete Prompt`, result);
    return result.status === 200;
}

// 12. Interact (Like/Pass)
async function testInteract(targetUserId) {
    const result = await apiCall('POST', '/interact', {
        target_user_id: targetUserId,
        action: 'LIKE',
        context: {
            type: 'IMAGE',
            id: 'img_1'
        },
        comment: 'Great photo!'
    }, true);
    logResult('POST /interact - Like/Pass Interaction', result);
    return result.status === 200;
}

// 13. Upload Profile Images
async function testUploadProfileImages() {
    const result = await apiCall('POST', '/profile/images', {
        image_url: 'https://example.com/image1.jpg'
    }, true);
    logResult('POST /profile/images - Upload Image', result);
    return result.status === 200;
}

// 14. Finalize Profile
async function testFinalizeProfile() {
    const result = await apiCall('POST', '/profile/finalize', {}, true);
    logResult('POST /profile/finalize - Finalize Profile', result);
    return result.status === 200;
}

// ============================================
// RUN ALL TESTS
// ============================================

async function runAllTests() {
    console.log('='.repeat(60));
    console.log('🧪 ALIGNED API TESTING');
    console.log('='.repeat(60));
    console.log(`Server: ${BASE_URL}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log('='.repeat(60));

    // PUBLIC ROUTES
    console.log('\n📌 PUBLIC ROUTES');
    console.log('-'.repeat(40));
    
    await testHealthCheck();

    // AUTHENTICATION FLOW
    console.log('\n📌 AUTHENTICATION FLOW');
    console.log('-'.repeat(40));
    
    await testPhoneLogin('+1234567890');
    await testPhoneVerify('123456');  // Mock code

    if (!authToken) {
        console.log('\n❌ Authentication failed. Cannot test protected routes.');
        return;
    }

    // PROTECTED ROUTES
    console.log('\n📌 PROTECTED ROUTES (Profile)');
    console.log('-'.repeat(40));
    
    await testGetProfile();
    await testUpdateProfile();
    await testUpdatePreferences();
    await testUploadProfileImages();

    console.log('\n📌 PROTECTED ROUTES (Feed)');
    console.log('-'.repeat(40));
    
    await testGetFeed();

    console.log('\n📌 PROTECTED ROUTES (Prompts)');
    console.log('-'.repeat(40));
    
    await testGetPrompts();
    await testCreatePrompt();
    await testUpdatePrompt(2);
    // await testDeletePrompt(0);  // Uncomment to test deletion

    // FINALIZE (Don't run unless you have 6 images)
    // await testFinalizeProfile();

    // INTERACT (requires a real target_user_id from the feed)
    // await testInteract('some-user-uuid-here');

    console.log('\n' + '='.repeat(60));
    console.log('✅ API Testing Complete!');
    console.log('='.repeat(60));
}

// Run tests
runAllTests().catch(console.error);

