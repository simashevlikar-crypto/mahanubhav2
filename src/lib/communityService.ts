/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  increment,
  onSnapshot,
  writeBatch,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage, handleFirestoreError, OperationType } from './firebase';
import {
  CommunityPost,
  CommunityAnswer,
  CommunityReply,
  CommunityUserProfile,
  CommunityReport,
  CommunityNotification,
} from '../types';

// Fallback demo posts when offline or initial setup
export const INITIAL_DEMO_POSTS: CommunityPost[] = [
  {
    id: 'post_demo_1',
    type: 'question',
    authorId: 'user_vishwajeet_shevlikar',
    authorName: 'Vishwajeet Shevlikar',
    authorUsername: 'vishwajeet',
    authorRole: 'vishwajeet shevlikar',
    authorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    title: 'श्रीचक्रधर स्वामींच्या लीळांमध्ये जाळीचा देव या स्थानाचा नेमका संदर्भ कोणता आहे?',
    content: 'जय श्रीकृष्ण! जाळीचा देव (ता. मोर्शी, जि. अमरावती) येथे सर्वज्ञ श्रीचक्रधर स्वामींनी केलेल्या लीळांचे सविस्तर संदर्भ लीळाचरित्रातील कोणत्या लीळांमध्ये आढळतात? या स्थानाचे विशेष दर्शन महत्त्व काय आहे?',
    category: '📖 लीळा व ग्रंथ',
    imageUrls: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800&auto=format&fit=crop'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    likesCount: 24,
    answersCount: 3,
    viewsCount: 156,
    sharesCount: 12,
    isPinned: true,
  },
  {
    id: 'post_demo_2',
    type: 'discussion',
    authorId: 'user_devotee_2',
    authorName: 'महंत गोपालराज शास्त्री',
    authorUsername: 'gopalraj_shastri',
    authorRole: 'admin',
    authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    title: 'आज आपण कोणती लीळा वाचत आहोत? आपले नित्य वाचन चिंतन सामायिक करा',
    content: 'सर्व भक्त साधकांना दंडवत प्रणाम! नित्य वाचनातून आपल्याला मिळणारी शांती आणि श्रीचक्रधर स्वामींच्या वचनांचे मनन याबद्दल आपले विचार आणि अनुभव या चर्चेमध्ये मांडावेत.',
    category: '💬 सामान्य चर्चा',
    imageUrls: [],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    likesCount: 38,
    answersCount: 5,
    viewsCount: 240,
    sharesCount: 8,
  },
  {
    id: 'post_demo_3',
    type: 'information',
    authorId: 'user_devotee_3',
    authorName: 'आनंदराज महानुभाव',
    authorUsername: 'anandraj_m',
    authorRole: 'user',
    authorPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    title: 'श्री क्षेत्र ऋद्धपूर धाम येथील आगामी अखंड नामस्मरण सप्ताह व दर्शन वेळ माहिती',
    content: 'आगामी एकादशीनिमित्त ऋद्धपूर येथील मुख्य राजमठ व गोविंदप्रभू चरणपादुका दर्शन वेळांमध्ये बदल करण्यात आला आहे. सर्व भाविक भक्तांनी दर्शनाचा लाभ घ्यावा.',
    category: '🛕 स्थान / देवस्थान',
    imageUrls: ['https://images.unsplash.com/photo-1609766857041-ed402ea8069a?q=80&w=800&auto=format&fit=crop'],
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    likesCount: 19,
    answersCount: 1,
    viewsCount: 95,
    sharesCount: 15,
  }
];

export const INITIAL_DEMO_ANSWERS: Record<string, CommunityAnswer[]> = {
  post_demo_1: [
    {
      id: 'ans_demo_1',
      postId: 'post_demo_1',
      authorId: 'user_devotee_2',
      authorName: 'महंत गोपालराज शास्त्री',
      authorUsername: 'gopalraj_shastri',
      authorRole: 'admin',
      authorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      content: 'दंडवत प्रणाम! लीळाचरित्र एकांक मधील लीळा क्रमांक ३२ व ३३ मध्ये जाळीच्या देवाच्या वनातील लीळेचा स्पष्ट उल्लेख आहे. स्वामींनी तेथे वृक्षाखाली विश्रांती घेऊन भक्तांना अनुग्रह दिला होता. स्थानपोथी मध्ये देखील या स्थानाची दिशा व सीमा सविस्तर नोंदवलेली आहे.',
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      likesCount: 15,
      repliesCount: 1,
      isAccepted: true,
    }
  ]
};

// Image Compression utility using HTML Canvas (Safe for Mobile & Web)
export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve) => {
    // If not an image or running without window/document, return raw
    if (!file.type.startsWith('image/') || typeof window === 'undefined') {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              resolve(blob || file);
            },
            'image/jpeg',
            quality
          );
        } else {
          resolve(file);
        }
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

// Upload Image to Firebase Storage with Safe Fallback
export async function uploadCommunityImage(file: File, pathPrefix: string): Promise<string> {
  try {
    const compressedBlob = await compressImage(file);
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
    const storageRef = ref(storage, `${pathPrefix}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, compressedBlob, {
      contentType: 'image/jpeg',
    });
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.warn('Firebase Storage upload warning (fallback to Data URL):', error);
    // If storage rules or bucket is not active, convert to Data URL so user is never blocked
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}

// ----------------------------------------------------
// USER PROFILE OPERATIONS
// ----------------------------------------------------

export async function getUserProfile(uid: string): Promise<CommunityUserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as CommunityUserProfile;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${uid}`);
  }
  return null;
}

export async function saveUserProfile(
  profile: Partial<CommunityUserProfile> & { uid: string; name: string }
): Promise<void> {
  const userRef = doc(db, 'users', profile.uid);
  const now = new Date().toISOString();

  const userPayload: CommunityUserProfile = {
    uid: profile.uid,
    name: profile.name,
    username: profile.username || profile.name.toLowerCase().replace(/\s+/g, '_'),
    phoneNumber: profile.phoneNumber || '',
    photoURL:
      profile.photoURL ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name)}&backgroundColor=f59e0b`,
    bio: profile.bio || '',
    createdAt: profile.createdAt || now,
    updatedAt: now,
    followersCount: profile.followersCount || 0,
    followingCount: profile.followingCount || 0,
    postsCount: profile.postsCount || 0,
    answersCount: profile.answersCount || 0,
    role: profile.role || (profile.name.toLowerCase().includes('vishwajeet') ? 'vishwajeet shevlikar' : 'user'),
    isBlocked: false,
  };

  try {
    await setDoc(userRef, userPayload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${profile.uid}`);
    // Save to localStorage fallback
    try {
      localStorage.setItem(`user_profile_${profile.uid}`, JSON.stringify(userPayload));
    } catch {}
  }
}

// ----------------------------------------------------
// COMMUNITY POSTS OPERATIONS
// ----------------------------------------------------

export async function fetchCommunityPosts(params: {
  category?: string;
  type?: string;
  sortBy?: 'latest' | 'popular';
  lastVisible?: QueryDocumentSnapshot | null;
  limitCount?: number;
  userId?: string;
}): Promise<{ posts: CommunityPost[]; lastDoc: QueryDocumentSnapshot | null }> {
  try {
    const postsRef = collection(db, 'communityPosts');
    let q = query(postsRef, where('isDeleted', '==', false));

    if (params.category && params.category !== 'all' && params.category !== 'सर्व') {
      q = query(q, where('category', '==', params.category));
    }

    if (params.type && params.type !== 'all') {
      q = query(q, where('type', '==', params.type));
    }

    if (params.userId) {
      q = query(q, where('authorId', '==', params.userId));
    }

    if (params.sortBy === 'popular') {
      q = query(q, orderBy('likesCount', 'desc'), orderBy('createdAt', 'desc'));
    } else {
      q = query(q, orderBy('createdAt', 'desc'));
    }

    const pageSize = params.limitCount || 20;
    q = query(q, limit(pageSize));

    if (params.lastVisible) {
      q = query(q, startAfter(params.lastVisible));
    }

    const querySnapshot = await getDocs(q);
    const posts: CommunityPost[] = [];
    querySnapshot.forEach((d) => {
      posts.push({ id: d.id, ...d.data() } as CommunityPost);
    });

    const last = querySnapshot.docs.length > 0 ? querySnapshot.docs[querySnapshot.docs.length - 1] : null;
    return { posts, lastDoc: last };
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'communityPosts');
    // If Firestore fails or offline, return demo posts with filter applied
    let filtered = [...INITIAL_DEMO_POSTS];
    if (params.category && params.category !== 'all' && params.category !== 'सर्व') {
      filtered = filtered.filter((p) => p.category === params.category);
    }
    if (params.type && params.type !== 'all') {
      filtered = filtered.filter((p) => p.type === params.type);
    }
    return { posts: filtered, lastDoc: null };
  }
}

export async function createCommunityPost(
  postData: Omit<CommunityPost, 'id' | 'createdAt' | 'updatedAt' | 'likesCount' | 'answersCount' | 'viewsCount' | 'sharesCount' | 'isPinned' | 'isDeleted' | 'isReported'>
): Promise<string> {
  const newId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newPost: CommunityPost = {
    ...postData,
    id: newId,
    createdAt: now,
    updatedAt: now,
    likesCount: 0,
    answersCount: 0,
    viewsCount: 1,
    sharesCount: 0,
    isPinned: false,
    isDeleted: false,
    isReported: false,
  };

  try {
    await setDoc(doc(db, 'communityPosts', newId), newPost);

    // Increment author's postsCount
    if (postData.authorId) {
      try {
        await updateDoc(doc(db, 'users', postData.authorId), {
          postsCount: increment(1),
          updatedAt: now,
        });
      } catch {}
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `communityPosts/${newId}`);
  }

  return newId;
}

export async function updateCommunityPost(postId: string, data: Partial<CommunityPost>): Promise<void> {
  try {
    await updateDoc(doc(db, 'communityPosts', postId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `communityPosts/${postId}`);
  }
}

export async function deleteCommunityPost(postId: string, authorId?: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'communityPosts', postId), {
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    });
    if (authorId) {
      try {
        await updateDoc(doc(db, 'users', authorId), {
          postsCount: increment(-1),
        });
      } catch {}
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `communityPosts/${postId}`);
  }
}

export async function pinCommunityPost(postId: string, isPinned: boolean): Promise<void> {
  try {
    await updateDoc(doc(db, 'communityPosts', postId), {
      isPinned,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `communityPosts/${postId}`);
  }
}

// ----------------------------------------------------
// LIKE & SAVE OPERATIONS
// ----------------------------------------------------

export async function toggleLikePost(postId: string, uid: string): Promise<boolean> {
  const likeRef = doc(db, 'communityPosts', postId, 'likes', uid);
  const postRef = doc(db, 'communityPosts', postId);

  try {
    const likeDoc = await getDoc(likeRef);
    if (likeDoc.exists()) {
      // User already liked -> Unlike
      await deleteDoc(likeRef);
      await updateDoc(postRef, { likesCount: increment(-1) });
      return false;
    } else {
      // User hasn't liked -> Like
      await setDoc(likeRef, {
        uid,
        createdAt: new Date().toISOString(),
      });
      await updateDoc(postRef, { likesCount: increment(1) });
      return true;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `communityPosts/${postId}/likes/${uid}`);
    return false;
  }
}

export async function checkIfUserLikedPost(postId: string, uid: string): Promise<boolean> {
  try {
    const likeDoc = await getDoc(doc(db, 'communityPosts', postId, 'likes', uid));
    return likeDoc.exists();
  } catch {
    return false;
  }
}

export async function toggleSavePost(postId: string, uid: string): Promise<boolean> {
  const saveRef = doc(db, 'users', uid, 'savedPosts', postId);

  try {
    const saveDoc = await getDoc(saveRef);
    if (saveDoc.exists()) {
      await deleteDoc(saveRef);
      return false;
    } else {
      await setDoc(saveRef, {
        postId,
        savedAt: new Date().toISOString(),
      });
      return true;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${uid}/savedPosts/${postId}`);
    return false;
  }
}

export async function fetchUserSavedPostIds(uid: string): Promise<string[]> {
  try {
    const savedSnap = await getDocs(collection(db, 'users', uid, 'savedPosts'));
    const ids: string[] = [];
    savedSnap.forEach((d) => ids.push(d.id));
    return ids;
  } catch {
    return [];
  }
}

// ----------------------------------------------------
// ANSWERS & REPLIES OPERATIONS
// ----------------------------------------------------

export async function fetchPostAnswers(postId: string): Promise<CommunityAnswer[]> {
  try {
    const answersRef = collection(db, 'communityPosts', postId, 'answers');
    const q = query(answersRef, where('isDeleted', '==', false), orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    const answers: CommunityAnswer[] = [];
    snap.forEach((d) => {
      answers.push({ id: d.id, ...d.data() } as CommunityAnswer);
    });
    return answers;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `communityPosts/${postId}/answers`);
    return INITIAL_DEMO_ANSWERS[postId] || [];
  }
}

export async function createAnswer(
  postId: string,
  answerData: Omit<CommunityAnswer, 'id' | 'postId' | 'createdAt' | 'updatedAt' | 'likesCount' | 'repliesCount' | 'isAccepted' | 'isDeleted' | 'isReported'>
): Promise<string> {
  const answerId = `ans_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newAnswer: CommunityAnswer = {
    ...answerData,
    id: answerId,
    postId,
    createdAt: now,
    updatedAt: now,
    likesCount: 0,
    repliesCount: 0,
    isAccepted: false,
    isDeleted: false,
    isReported: false,
  };

  try {
    await setDoc(doc(db, 'communityPosts', postId, 'answers', answerId), newAnswer);
    await updateDoc(doc(db, 'communityPosts', postId), {
      answersCount: increment(1),
      updatedAt: now,
    });

    if (answerData.authorId) {
      try {
        await updateDoc(doc(db, 'users', answerData.authorId), {
          answersCount: increment(1),
        });
      } catch {}
    }

    // Send notification to post author if not the same user
    try {
      const postSnap = await getDoc(doc(db, 'communityPosts', postId));
      if (postSnap.exists()) {
        const postData = postSnap.data() as CommunityPost;
        if (postData.authorId && postData.authorId !== answerData.authorId) {
          await createNotification(postData.authorId, {
            type: 'answer',
            fromUserId: answerData.authorId,
            fromUserName: answerData.authorName,
            fromUserPhoto: answerData.authorPhoto,
            postId,
            answerId,
            message: `${answerData.authorName} यांनी आपल्या प्रश्नाचे उत्तर दिले आहे.`,
          });
        }
      }
    } catch {}
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `communityPosts/${postId}/answers/${answerId}`);
  }

  return answerId;
}

export async function markAcceptedAnswer(postId: string, answerId: string, isAccepted: boolean): Promise<void> {
  try {
    await updateDoc(doc(db, 'communityPosts', postId, 'answers', answerId), {
      isAccepted,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `communityPosts/${postId}/answers/${answerId}`);
  }
}

export async function deleteAnswer(postId: string, answerId: string, authorId?: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'communityPosts', postId, 'answers', answerId), {
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    });
    await updateDoc(doc(db, 'communityPosts', postId), {
      answersCount: increment(-1),
    });
    if (authorId) {
      try {
        await updateDoc(doc(db, 'users', authorId), {
          answersCount: increment(-1),
        });
      } catch {}
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `communityPosts/${postId}/answers/${answerId}`);
  }
}

export async function toggleLikeAnswer(postId: string, answerId: string, uid: string): Promise<boolean> {
  const likeRef = doc(db, 'communityPosts', postId, 'answers', answerId, 'likes', uid);
  const ansRef = doc(db, 'communityPosts', postId, 'answers', answerId);

  try {
    const likeDoc = await getDoc(likeRef);
    if (likeDoc.exists()) {
      await deleteDoc(likeRef);
      await updateDoc(ansRef, { likesCount: increment(-1) });
      return false;
    } else {
      await setDoc(likeRef, { uid, createdAt: new Date().toISOString() });
      await updateDoc(ansRef, { likesCount: increment(1) });
      return true;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `communityPosts/${postId}/answers/${answerId}/likes/${uid}`);
    return false;
  }
}

export async function fetchAnswerReplies(postId: string, answerId: string): Promise<CommunityReply[]> {
  try {
    const repliesRef = collection(db, 'communityPosts', postId, 'answers', answerId, 'replies');
    const q = query(repliesRef, where('isDeleted', '==', false), orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    const replies: CommunityReply[] = [];
    snap.forEach((d) => {
      replies.push({ id: d.id, ...d.data() } as CommunityReply);
    });
    return replies;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, `communityPosts/${postId}/answers/${answerId}/replies`);
    return [];
  }
}

export async function createReply(
  postId: string,
  answerId: string,
  replyData: Omit<CommunityReply, 'id' | 'postId' | 'answerId' | 'createdAt' | 'likesCount' | 'isDeleted'>
): Promise<string> {
  const replyId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newReply: CommunityReply = {
    ...replyData,
    id: replyId,
    postId,
    answerId,
    createdAt: now,
    likesCount: 0,
    isDeleted: false,
  };

  try {
    await setDoc(doc(db, 'communityPosts', postId, 'answers', answerId, 'replies', replyId), newReply);
    await updateDoc(doc(db, 'communityPosts', postId, 'answers', answerId), {
      repliesCount: increment(1),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `communityPosts/${postId}/answers/${answerId}/replies/${replyId}`);
  }

  return replyId;
}

// ----------------------------------------------------
// FOLLOW SYSTEM
// ----------------------------------------------------

export async function toggleFollowUser(currentUid: string, targetUid: string): Promise<boolean> {
  if (currentUid === targetUid) return false;

  const followerRef = doc(db, 'users', targetUid, 'followers', currentUid);
  const followingRef = doc(db, 'users', currentUid, 'following', targetUid);

  try {
    const followDoc = await getDoc(followerRef);
    if (followDoc.exists()) {
      // Unfollow
      await deleteDoc(followerRef);
      await deleteDoc(followingRef);
      await updateDoc(doc(db, 'users', targetUid), { followersCount: increment(-1) });
      await updateDoc(doc(db, 'users', currentUid), { followingCount: increment(-1) });
      return false;
    } else {
      // Follow
      const now = new Date().toISOString();
      await setDoc(followerRef, { uid: currentUid, followedAt: now });
      await setDoc(followingRef, { uid: targetUid, followedAt: now });
      await updateDoc(doc(db, 'users', targetUid), { followersCount: increment(1) });
      await updateDoc(doc(db, 'users', currentUid), { followingCount: increment(1) });

      // Notify target user
      try {
        const currentUserProfile = await getUserProfile(currentUid);
        await createNotification(targetUid, {
          type: 'follow',
          fromUserId: currentUid,
          fromUserName: currentUserProfile?.name || 'एक साधक',
          fromUserPhoto: currentUserProfile?.photoURL,
          message: `${currentUserProfile?.name || 'एका साधकाने'} तुम्हाला फॉलो केले आहे.`,
        });
      } catch {}

      return true;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${targetUid}/followers/${currentUid}`);
    return false;
  }
}

export async function checkIfFollowing(currentUid: string, targetUid: string): Promise<boolean> {
  if (!currentUid || !targetUid || currentUid === targetUid) return false;
  try {
    const docSnap = await getDoc(doc(db, 'users', targetUid, 'followers', currentUid));
    return docSnap.exists();
  } catch {
    return false;
  }
}

// ----------------------------------------------------
// NOTIFICATIONS
// ----------------------------------------------------

export async function createNotification(
  targetUid: string,
  notification: Omit<CommunityNotification, 'id' | 'createdAt' | 'read'>
): Promise<void> {
  const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const newNotif: CommunityNotification = {
    ...notification,
    id: notifId,
    createdAt: new Date().toISOString(),
    read: false,
  };

  try {
    await setDoc(doc(db, 'users', targetUid, 'notifications', notifId), newNotif);
  } catch (err) {
    console.warn('Failed to send notification:', err);
  }
}

export async function fetchUserNotifications(uid: string): Promise<CommunityNotification[]> {
  try {
    const notifsRef = collection(db, 'users', uid, 'notifications');
    const q = query(notifsRef, orderBy('createdAt', 'desc'), limit(30));
    const snap = await getDocs(q);
    const notifications: CommunityNotification[] = [];
    snap.forEach((d) => {
      notifications.push({ id: d.id, ...d.data() } as CommunityNotification);
    });
    return notifications;
  } catch {
    return [];
  }
}

export async function markNotificationRead(uid: string, notifId: string): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid, 'notifications', notifId), {
      read: true,
    });
  } catch {}
}

// ----------------------------------------------------
// REPORT SYSTEM & ADMIN MODERATION
// ----------------------------------------------------

export async function createReport(
  reportData: Omit<CommunityReport, 'id' | 'createdAt' | 'status'>
): Promise<void> {
  const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newReport: CommunityReport = {
    ...reportData,
    id: reportId,
    createdAt: new Date().toISOString(),
    status: 'pending',
  };

  try {
    await setDoc(doc(db, 'communityReports', reportId), newReport);

    // Mark post or target as reported
    if (reportData.targetType === 'post') {
      await updateDoc(doc(db, 'communityPosts', reportData.targetId), {
        isReported: true,
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `communityReports/${reportId}`);
  }
}

export async function fetchReports(): Promise<CommunityReport[]> {
  try {
    const q = query(collection(db, 'communityReports'), orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    const reports: CommunityReport[] = [];
    snap.forEach((d) => {
      reports.push({ id: d.id, ...d.data() } as CommunityReport);
    });
    return reports;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'communityReports');
    return [];
  }
}

export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
): Promise<void> {
  try {
    await updateDoc(doc(db, 'communityReports', reportId), {
      status,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `communityReports/${reportId}`);
  }
}

export async function setUserBlockStatus(uid: string, isBlocked: boolean): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', uid), {
      isBlocked,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
  }
}
