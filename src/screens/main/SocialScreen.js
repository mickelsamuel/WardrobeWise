import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';

// Mock data for stories
const storyData = [
  { id: '1', name: 'Emma', image: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Tom', image: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Sara', image: 'https://via.placeholder.com/50' },
  { id: '4', name: 'Mike', image: 'https://via.placeholder.com/50' },
  { id: '5', name: 'Julie', image: 'https://via.placeholder.com/50' },
  { id: '6', name: 'Alex', image: 'https://via.placeholder.com/50' },
];

// Mock data for feed posts
const feedData = [
  {
    id: '1',
    username: 'Emma Johnson',
    userImage: 'https://via.placeholder.com/40',
    date: '2 hours ago',
    outfitImage: 'https://via.placeholder.com/400',
    description: 'Today\'s sustainable outfit for the office meeting! #sustainablefashion',
    likes: 24,
    comments: 6,
    isLiked: false,
  },
  {
    id: '2',
    username: 'Tom Wilson',
    userImage: 'https://via.placeholder.com/40',
    date: '5 hours ago',
    outfitImage: 'https://via.placeholder.com/400',
    description: 'Perfect casual Friday look with my favorite recycled denim!',
    likes: 18,
    comments: 3,
    isLiked: true,
  },
  {
    id: '3',
    username: 'Sara Miller',
    userImage: 'https://via.placeholder.com/40',
    date: 'Yesterday',
    outfitImage: 'https://via.placeholder.com/400',
    description: 'Trying out this new thrifted jacket for fall. What do you think?',
    likes: 32,
    comments: 8,
    isLiked: false,
  },
];

// Friend search results mock data
const searchResults = [
  { id: '1', name: 'Chris Evans', email: 'chris.e@example.com', image: 'https://via.placeholder.com/40' },
  { id: '2', name: 'Taylor Swift', email: 'taylor.s@example.com', image: 'https://via.placeholder.com/40' },
  { id: '3', name: 'Elon Musk', email: 'elon.m@example.com', image: 'https://via.placeholder.com/40' },
];

const SocialScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [localFeedData, setLocalFeedData] = useState(feedData);
  
  // Handle search input
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  // Toggle like on a post
  const toggleLike = (postId) => {
    setLocalFeedData(localFeedData.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  // Add friend function (placeholder)
  const addFriend = (id) => {
    // In a real app, this would send a friend request
    console.log(`Friend request sent to user with id: ${id}`);
  };

  // Story Item Component
  const StoryItem = ({ item }) => (
    <TouchableOpacity style={styles.storyItem}>
      <View style={styles.storyCircle}>
        <Image source={{ uri: item.image }} style={styles.storyImage} />
      </View>
      <Text style={styles.storyName} numberOfLines={1}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Search Result Item Component
  const SearchResultItem = ({ item }) => (
    <View style={styles.searchResultItem}>
      <Image source={{ uri: item.image }} style={styles.searchResultImage} />
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultName}>{item.name}</Text>
        <Text style={styles.searchResultEmail}>{item.email}</Text>
      </View>
      <TouchableOpacity 
        style={styles.addFriendButton}
        onPress={() => addFriend(item.id)}
      >
        <Text style={styles.addFriendButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Feed Post Item Component
  const FeedItem = ({ item }) => (
    <View style={styles.feedItem}>
      {/* Post Header */}
      <View style={styles.feedItemHeader}>
        <Image source={{ uri: item.userImage }} style={styles.profileImage} />
        <View style={styles.feedItemHeaderText}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      
      {/* Post Image */}
      <TouchableOpacity 
        style={styles.outfitImageContainer}
        onPress={() => console.log(`Opening detailed view for post ${item.id}`)}
      >
        <Image source={{ uri: item.outfitImage }} style={styles.outfitImage} />
      </TouchableOpacity>
      
      {/* Description */}
      <Text style={styles.description}>{item.description}</Text>
      
      {/* Like & Comment Section */}
      <View style={styles.interactionBar}>
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>{item.likes} likes • {item.comments} comments</Text>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleLike(item.id)}
          >
            <Feather 
              name={item.isLiked ? "heart" : "heart"} 
              size={22} 
              color={item.isLiked ? "#F2B705" : "#666"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="message-circle" size={22} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends by username"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      
      {/* Search Results (conditional render) */}
      {showSearchResults ? (
        <View style={styles.searchResultsContainer}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <FlatList
            data={searchResults}
            renderItem={({ item }) => <SearchResultItem item={item} />}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.searchResultsList}
          />
          <View style={styles.divider} />
        </View>
      ) : (
        <>
          {/* Stories Row */}
          <View style={styles.storiesContainer}>
            <Text style={styles.sectionTitle}>Daily Outfits</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScrollView}>
              {storyData.map(item => (
                <StoryItem key={item.id} item={item} />
              ))}
            </ScrollView>
            <View style={styles.divider} />
          </View>
          
          {/* Feed */}
          <View style={styles.feedContainer}>
            <Text style={styles.sectionTitle}>Friend Feed</Text>
            <FlatList
              data={localFeedData}
              renderItem={({ item }) => <FeedItem item={item} />}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </>
      )}
      
      {/* Navigation Bar would be here - typically implemented in a parent component */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#48AAA6',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
    color: '#333',
  },
  searchResultsList: {
    paddingBottom: 16,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchResultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  searchResultEmail: {
    fontSize: 14,
    color: '#777',
  },
  addFriendButton: {
    backgroundColor: '#F2B705',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  addFriendButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
  },
  storiesContainer: {
    paddingHorizontal: 16,
  },
  storiesScrollView: {
    paddingBottom: 12,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 68,
  },
  storyCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#48AAA6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  storyName: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  feedContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  feedItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  feedItemHeaderText: {
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  outfitImageContainer: {
    width: '100%',
    height: 400,
  },
  outfitImage: {
    width: '100%',
    height: '100%',
  },
  description: {
    fontSize: 14,
    color: '#333',
    padding: 12,
    paddingBottom: 8,
  },
  interactionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 12,
    alignItems: 'center',
  },
  statsContainer: {
    flex: 1,
  },
  stats: {
    fontSize: 12,
    color: '#777',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
});

export default SocialScreen;