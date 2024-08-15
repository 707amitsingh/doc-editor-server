const Document = require("../schemas/document");

const DEFAULT_DOC_VALUE = "";

async function findOrCreateDocument(id) {
  if (!id) return;

  const document = await Document.findById(id);
  if (document) return document;

  return await Document.create({ _id: id, data: DEFAULT_DOC_VALUE });
}

async function saveDocument(id, data) {
  const doc = await Document.findOneAndUpdate({ _id: id }, { data });
}

module.exports = { findOrCreateDocument, saveDocument };
