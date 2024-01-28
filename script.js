import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate, ChatPromptTemplate } from "langchain/prompts";
import { ConversationSummaryMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import {
    AzureAISearchVectorStore,
    AzureAISearchQueryType,
  } from "@langchain/community/vectorstores/azure_aisearch";


// const loader = new TextLoader("src/text.txt");
// const docs = await loader.load();

// Use the correct environment variable name
process.env.OPENAI_API_KEY = 'df03eae4e9ac4e9cbae0f8faf41013c7';

// Load the scraping data when it's done
// const vectorStore = await MemoryVectorStore.fromDocuments()

const loader = new TextLoader("./state_of_the_union.txt");
const rawDocuments = await loader.load();
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 0,
});
const documents = await splitter.splitDocuments(rawDocuments);

// Create Azure AI Search vector store
const store = await AzureAISearchVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings(),
    {
      search: {
        type: AzureAISearchQueryType.SimilarityHybrid,
      },
    }
  );

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a nice chatbot having an informative conversation with a student pursuing college that is seeking answers to their college-related questions. However, you must assume that the question is asking about the year " + new Date().getFullYear() + ", unless specified otherwise. Please ask for confirmation if the questions are missing necessary details and answer the student's question if you have enough details. After receiving the necessary details, make sure to answer the question being asked, without being prompted again. If you were already given context, use the context that was given unless given other instructions by the user."],
    ["human", "{chat_history}\n{question}"]
]);

const model = new ChatOpenAI({
    azureOpenAIApiKey: 'df03eae4e9ac4e9cbae0f8faf41013c7',
    azureOpenAIApiInstanceName: 'hoya-hacks-2024-umd',
    azureOpenAIApiDeploymentName: 'gpt-35-turbo',
    azureOpenAIApiVersion: '2023-09-15-preview',
    temperature: 0 // TODO try experimenting with low temperatures (~0.2)
});

const memory = new ConversationSummaryMemory({
    memoryKey: "chat_history",
    llm: model
});

// const promptTemplate = PromptTemplate.fromTemplate("Tell me a joke about {topic}");

const chatConversationChain = new LLMChain({
    llm: model,
    prompt: prompt,
    verbose: false,
    memory: memory
});

const arr = [
    'What is the cost of tuition at UMD?',
    'I live in Annapolis, Maryland. I am referring to College Park.',
    'What are the dininig halls on campus',
    'How many people were accepted to UMD'
];

for await (const question of arr) {
    const res = await chatConversationChain.call({
        question
    });
    console.log(question);
    console.log({ res, memory: await memory.loadMemoryVariables({}) });
}

/*
const res = await chatConversationChain.call({
    question: 'What is the cost of tuition at UMD?'
});
console.log({ res, memory: await memory.loadMemoryVariables({}) });

const res2 = await chatConversationChain.call({
    question: 'I live in Annapolis, Maryland. I am referring to College Park.'
});
console.log({ res2, memory: await memory.loadMemoryVariables({}) });

const res3 = await chatConversationChain.call({
    // question: 'wht r the dinig hals of camps'
    question: 'What are the dininig halls on campus'
});
console.log({ res3, memory: await memory.loadMemoryVariables({}) });
*/

  

// https://hoya-hacks-2024-umd.openai.azure.com/openai/deployments/gpt-35-turbo/completions?api-version=2023-09-15-preview
// https://{MY_INSTANCE_NAME}.openai.azure.com/openai/deployments/{DEPLOYMENT_NAME}