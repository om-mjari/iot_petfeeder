// Firestore Service Module
import { db } from "../config/firestore.js";

/**
 * Generic CRUD operations for Firestore
 */

// Create a new document
export const createDocument = async (collectionName, data) => {
  try {
    const docRef = await db.collection(collectionName).add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(`Error creating document: ${error.message}`);
  }
};

// Get all documents from a collection
export const getAllDocuments = async (collectionName) => {
  try {
    const snapshot = await db.collection(collectionName).get();
    const documents = [];
    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    throw new Error(`Error fetching documents: ${error.message}`);
  }
};

// Get a document by ID
export const getDocumentById = async (collectionName, id) => {
  try {
    const doc = await db.collection(collectionName).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    throw new Error(`Error fetching document: ${error.message}`);
  }
};

// Update a document by ID
export const updateDocument = async (collectionName, id, data) => {
  try {
    await db.collection(collectionName).doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
    return { id, ...data };
  } catch (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }
};

// Delete a document by ID
export const deleteDocument = async (collectionName, id) => {
  try {
    await db.collection(collectionName).doc(id).delete();
    return { message: "Document deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
};

// Get documents with query
export const queryDocuments = async (collectionName, field, operator, value) => {
  try {
    const snapshot = await db
      .collection(collectionName)
      .where(field, operator, value)
      .get();
    const documents = [];
    snapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() });
    });
    return documents;
  } catch (error) {
    throw new Error(`Error querying documents: ${error.message}`);
  }
};

// Listen to real-time updates
export const listenToCollection = (collectionName, callback) => {
  return db.collection(collectionName).onSnapshot(
    (snapshot) => {
      const changes = {
        added: [],
        modified: [],
        removed: [],
      };
      
      snapshot.docChanges().forEach((change) => {
        const data = { id: change.doc.id, ...change.doc.data() };
        changes[change.type].push(data);
      });
      
      callback(null, changes);
    },
    (error) => {
      callback(error, null);
    }
  );
};

export default {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  queryDocuments,
  listenToCollection,
};