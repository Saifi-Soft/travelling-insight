
import { communityPostsApi } from './communityPostsService';
import { notificationsApi } from './notificationsService';
import { contentModerationApi } from './contentModerationService';

// Function to extend the community API with our new services
export const extendCommunityApi = (existingApi: any) => {
  return {
    ...existingApi,
    posts: communityPostsApi,
    notifications: notificationsApi,
    moderation: contentModerationApi
  };
};
