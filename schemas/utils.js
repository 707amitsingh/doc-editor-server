const Document = require("../schemas/document");

const DEFAULT_DOC_VALUE = "";

async function findOrCreateDocument(id) {
  if (!id) return;

  const document = await Document.findById(id);
  if (document) return document;

  return await Document.create({ _id: id, data: DEFAULT_DOC_VALUE });
}

async function saveDocument(id, data) {
  await Document.findOneAndUpdate(
    { _id: id }, // Query to find the document by id
    { data, updatedAt: new Date() }, // Update the content and the updatedAt timestamp
    { upsert: true, new: true } // Create a new document if it doesn't exist, return the updated document
  );
}

module.exports = { findOrCreateDocument, saveDocument };
