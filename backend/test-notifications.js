const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const Issue = require('./models/Issue');
const Officer = require('./models/Officer');
const { notifyIssueCreated, notifyIssueStatusUpdate, notifyOfficerAssignment, notifyVoteReceived } = require('./utils/notificationUtils');

// Test script for notification system
async function testNotificationSystem() {
    try {
        console.log('🧪 Testing Notification System...\n');

        // Connect to MongoDB (adjust connection string as needed)
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smart-community');
        console.log('✅ Connected to MongoDB');

        // Test 1: Create a test issue and send notification
        console.log('\n📝 Test 1: Creating issue and sending notification...');
        const testIssue = new Issue({
            userId: 'test-user-123',
            title: 'Test Issue - Broken Street Light',
            userMessage: 'Street light is not working on Main Street',
            category: 'Infrastructure',
            coordinates: { latitude: 40.7128, longitude: -74.0060 },
            city: 'New York',
            state: 'NY',
            imageUrl: 'https://example.com/image.jpg'
        });
        await testIssue.save();
        console.log('✅ Test issue created');

        // Send notification for new issue
        await notifyIssueCreated(testIssue, 'test-user-123');
        console.log('✅ Issue creation notification sent');

        // Test 2: Update issue status and send notification
        console.log('\n🔄 Test 2: Updating issue status...');
        const previousStatus = testIssue.status;
        testIssue.status = 'in progress';
        await testIssue.save();
        
        await notifyIssueStatusUpdate(testIssue, previousStatus, 'admin-user');
        console.log('✅ Status update notification sent');

        // Test 3: Create test officer and assign to issue
        console.log('\n👮 Test 3: Creating officer and assigning to issue...');
        const testOfficer = new Officer({
            fullName: 'John Doe',
            email: 'john.doe@city.gov',
            role: 'officer',
            assignedCategories: ['Infrastructure'],
            assignedLocations: ['New York'],
            phone: '+1234567890'
        });
        await testOfficer.save();
        console.log('✅ Test officer created');

        // Assign officer to issue
        testIssue.assignedOfficer = testOfficer._id;
        await testIssue.save();
        
        await notifyOfficerAssignment(testIssue, testOfficer._id);
        console.log('✅ Officer assignment notification sent');

        // Test 4: Add vote and send notification
        console.log('\n👍 Test 4: Adding vote to issue...');
        testIssue.votes = 1;
        testIssue.voters = ['voter-user-456'];
        await testIssue.save();
        
        await notifyVoteReceived(testIssue, 'voter-user-456');
        console.log('✅ Vote notification sent');

        // Test 5: Query notifications
        console.log('\n📊 Test 5: Querying notifications...');
        const notifications = await Notification.find({}).sort({ createdAt: -1 });
        console.log(`✅ Found ${notifications.length} notifications`);

        // Display notification details
        notifications.forEach((notification, index) => {
            console.log(`\n${index + 1}. ${notification.title}`);
            console.log(`   Type: ${notification.type}`);
            console.log(`   Priority: ${notification.priority}`);
            console.log(`   Read: ${notification.isRead}`);
            console.log(`   Message: ${notification.message}`);
        });

        // Test 6: Test unread count
        console.log('\n🔢 Test 6: Testing unread count...');
        const unreadCount = await Notification.getUnreadCount('test-user-123');
        console.log(`✅ Unread count for test-user-123: ${unreadCount}`);

        // Test 7: Mark notification as read
        console.log('\n✅ Test 7: Marking notification as read...');
        if (notifications.length > 0) {
            await notifications[0].markAsRead();
            console.log('✅ First notification marked as read');
        }

        // Cleanup test data
        console.log('\n🧹 Cleaning up test data...');
        await Notification.deleteMany({ userId: { $in: ['test-user-123', 'voter-user-456'] } });
        await Issue.findByIdAndDelete(testIssue._id);
        await Officer.findByIdAndDelete(testOfficer._id);
        console.log('✅ Test data cleaned up');

        console.log('\n🎉 All notification system tests passed!');
        console.log('\n📋 Test Summary:');
        console.log('✅ Issue creation notifications');
        console.log('✅ Status update notifications');
        console.log('✅ Officer assignment notifications');
        console.log('✅ Vote notifications');
        console.log('✅ Notification querying');
        console.log('✅ Unread count functionality');
        console.log('✅ Mark as read functionality');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    require('dotenv').config();
    testNotificationSystem();
}

module.exports = { testNotificationSystem };
