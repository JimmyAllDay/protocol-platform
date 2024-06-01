import { db } from 'lib/firebase/client/config';
import {
  doc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

import isEqual from 'lodash/isEqual';

export const checkRateLimit = (updateCount, lastUpdate) => {
  const currentTime = new Date().getTime();
  const lastUpdateTime = new Date(lastUpdate || 0).getTime();
  const timeDiff = currentTime - lastUpdateTime;
  const oneDay = 86400000; // milliseconds in one day

  if (timeDiff < oneDay && updateCount >= 3) {
    return {
      canUpdate: false,
      message: 'Update limit reached. Please try again later.',
    };
  } else {
    return {
      canUpdate: true,
      newCount: timeDiff >= oneDay ? 1 : updateCount + 1,
      newLastUpdate: currentTime,
    };
  }
};

export const findChanges = (original, updated) => {
  const changes = {};
  Object.keys(updated).forEach((key) => {
    if (!isEqual(original[key], updated[key])) {
      changes[key] = updated[key];
    }
  });
  return changes;
};

//TODO: user can't update profile once it's complete for the first time - you'll need to adjust the updateUserProfile function to facilitate this

export const updateUserProfile = async (data, uid, email) => {
  try {
    //Get document references
    const userProfileRef = doc(db, 'userProfiles', uid);
    const userManagementRef = doc(db, 'userManagement', uid);

    //Get a snapshot of the user's userManagement doc
    const userManagementSnapshot = await getDoc(userManagementRef);
    //Create an object for managing the user's profile updates within the userManagement doc
    let userProfileUpdates = {
      count: 0,
      lastUpdateTimestamp: 0,
      complete: false, // Ensure this defaults to false if not set
    };

    //Extract data if userManagementSnapshot exists
    if (userManagementSnapshot.exists()) {
      const managementData = userManagementSnapshot.data();
      userProfileUpdates =
        managementData.userProfileUpdates || userProfileUpdates;
    }

    const currentTime = new Date().getTime();
    const lastUpdateTime = new Date(
      userProfileUpdates.lastUpdateTimestamp || 0
    ).getTime();
    const timeDiff = currentTime - lastUpdateTime;
    const oneDay = 86400000; // milliseconds in one day

    if (timeDiff < oneDay && userProfileUpdates.count >= 3) {
      return { message: 'Update limit reached. Please try again later.' };
    }

    const newCount = timeDiff >= oneDay ? 1 : userProfileUpdates.count + 1;
    const newLastUpdateTimestamp = serverTimestamp();

    const docSnapshot = await getDoc(userProfileRef);
    if (!docSnapshot.exists()) {
      console.error('No such document!');
      return { error: 'No such document!' };
    }
    const originalData = docSnapshot.data();

    const updatedProps = findChanges(originalData, data);
    console.log('updated props: ', updatedProps);

    if (Object.keys(updatedProps).length === 0) {
      return { message: 'No changes made, profile not updated.' };
    }

    await updateDoc(userProfileRef, {
      ...updatedProps,
      updatedAt: serverTimestamp(),
    });

    await updateDoc(userManagementRef, {
      userProfileUpdates: {
        count: newCount,
        lastUpdateTimestamp: newLastUpdateTimestamp,
        complete: true, // Set to true on first update and never reset
      },
    });

    const updatedDocSnapshot = await getDoc(userProfileRef);
    if (updatedDocSnapshot.exists()) {
      console.log('Updated Document Data:', updatedDocSnapshot.data());
      return updatedDocSnapshot.data();
    } else {
      console.error('No such document!');
      return { error: 'Failed to fetch updated document.' };
    }
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};
