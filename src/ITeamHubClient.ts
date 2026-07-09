import type {
  AdminEntityConfig,
  AdminResourceOption,
  CollectionRecord,
  CreateCollectionInput,
  CreateEnvironmentInput,
  CreateFolderInput,
  CreateRequestInput,
  CreateRunResultInput,
  CreateSnippetInput,
  EnvironmentRecord,
  FolderRecord,
  HealthResponse,
  HubUserRecord,
  MoveRequestInput,
  PluginSourcesResponse,
  RenameFolderInput,
  ReorderFoldersInput,
  ReorderRequestsInput,
  RunResultDetail,
  RunResultRecord,
  SavedRequestRecord,
  SessionResponse,
  SnippetRecord,
  TeamHubAdminResourceOptions,
  UpdateCollectionInput,
  UpdateEnvironmentInput,
  UpdateHubUserInput,
  CreateHubUserInput,
  HubApiTokenRecord,
  CreatedHubUser,
  CreateHubTokenInput,
  CreatedHubToken,
  UpdateRequestInput,
  UpdateSnippetInput,
  ReloadConfigResponse
} from './types.js';
import type { ChatStepResult, ListHubLlmModelsResponse } from './appTypes.js';
import type { HubChatStepRequest } from './TeamHubClient.js';

/**
 * Typed HTTP client for HarborClient Server entity and health routes.
 */
export interface ITeamHubClient {
  /**
   * Probes server availability via the public health endpoint.
   */
  checkHealth(): Promise<HealthResponse>;

  /**
   * Returns the authenticated user, token metadata, and derived API capabilities.
   *
   * Calls `GET /auth/session` with bearer auth. Use this to discover whether
   * a token belongs to a `user` or `admin` account before gating management UI.
   */
  getSession(): Promise<SessionResponse>;

  /**
   * Lists all Team Hub user accounts visible to an admin-role token.
   */
  listAdminUsers(): Promise<HubUserRecord[]>;

  /**
   * Creates a Team Hub user account and an initial API bearer token.
   *
   * @param input - User fields for the new account.
   */
  createAdminUser(input: CreateHubUserInput): Promise<CreatedHubUser>;

  /**
   * Updates a Team Hub user account via the management API.
   *
   * @param id - User account identifier.
   * @param input - Partial user fields to apply.
   */
  updateAdminUser(id: string, input: UpdateHubUserInput): Promise<HubUserRecord>;

  /**
   * Deletes a Team Hub user account and their API tokens via the management API.
   *
   * @param id - User account identifier.
   */
  deleteAdminUser(id: string): Promise<void>;

  /**
   * Lists all API bearer tokens visible to an admin-role token.
   */
  listAdminTokens(): Promise<HubApiTokenRecord[]>;

  /**
   * Creates an additional API bearer token for a user account.
   *
   * @param userId - Owning user account identifier.
   * @param input - Human-readable label for the new token.
   */
  createAdminUserToken(userId: string, input: CreateHubTokenInput): Promise<CreatedHubToken>;

  /**
   * Permanently deletes an API bearer token via the management API.
   *
   * @param id - Token record identifier.
   */
  deleteAdminToken(id: string): Promise<void>;

  /**
   * Lists all collections as id/name metadata for admin user management.
   */
  listAdminCollections(): Promise<AdminResourceOption[]>;

  /**
   * Lists all environments as id/name metadata for admin user management.
   */
  listAdminEnvironments(): Promise<AdminResourceOption[]>;

  /**
   * Lists folders in a collection for operator inspection.
   *
   * @param collectionId - Parent collection UUID.
   */
  listAdminCollectionFolders(collectionId: string): Promise<FolderRecord[]>;

  /**
   * Lists saved requests in a collection for operator inspection.
   *
   * @param collectionId - Parent collection UUID.
   */
  listAdminCollectionRequests(collectionId: string): Promise<SavedRequestRecord[]>;

  /**
   * Deletes a collection via the admin management API.
   *
   * @param id - Collection UUID.
   */
  deleteAdminCollection(id: string): Promise<void>;

  /**
   * Deletes an environment via the admin management API.
   *
   * @param id - Environment UUID.
   */
  deleteAdminEnvironment(id: string): Promise<void>;

  /**
   * Deletes a saved request via the admin management API.
   *
   * @param id - Saved request UUID.
   */
  deleteAdminRequest(id: string): Promise<void>;

  /**
   * Updates whether non-admin users may delete a collection.
   *
   * @param id - Collection UUID.
   * @param deletionLocked - When true, user-role tokens cannot delete the collection.
   */
  updateAdminCollectionDeletionLocked(
    id: string,
    deletionLocked: boolean
  ): Promise<AdminEntityConfig>;

  /**
   * Updates whether non-admin users may delete an environment.
   *
   * @param id - Environment UUID.
   * @param deletionLocked - When true, user-role tokens cannot delete the environment.
   */
  updateAdminEnvironmentDeletionLocked(
    id: string,
    deletionLocked: boolean
  ): Promise<AdminEntityConfig>;

  /**
   * Lists all snippets for admin user management.
   */
  listAdminSnippets(): Promise<SnippetRecord[]>;

  /**
   * Creates a snippet through the management API.
   *
   * @param input - Display name, JavaScript source, and scope for the new snippet.
   */
  createAdminSnippet(input: CreateSnippetInput): Promise<SnippetRecord>;

  /**
   * Updates a snippet's name, code, and scope through the management API.
   *
   * @param id - Snippet UUID.
   * @param input - Updated snippet fields.
   */
  updateAdminSnippet(id: string, input: UpdateSnippetInput): Promise<SnippetRecord>;

  /**
   * Deletes a snippet regardless of deletion lock state.
   *
   * @param id - Snippet UUID.
   */
  deleteAdminSnippet(id: string): Promise<void>;

  /**
   * Lists all run results for admin management.
   */
  listAdminRunResults(): Promise<RunResultRecord[]>;

  /**
   * Deletes a run result regardless of creator ownership.
   *
   * @param id - Run result UUID.
   */
  deleteAdminRunResult(id: string): Promise<void>;

  /**
   * Lists all hub-offered LLM models for admin user management.
   */
  listAdminLlmModels(): Promise<ListHubLlmModelsResponse>;

  /**
   * Lists hub-offered LLM models visible to the authenticated token.
   */
  listLlmModels(): Promise<ListHubLlmModelsResponse>;

  /**
   * Runs one hub-proxied LLM completion step.
   */
  completeChatStep(input: HubChatStepRequest): Promise<ChatStepResult>;

  /**
   * Returns whether the Team Hub server has LLM support configured.
   *
   * @param managementApi - When true, probes `GET /admin/llm/models`.
   */
  probeLlmServiceEnabled(managementApi: boolean): Promise<boolean>;

  /**
   * Returns whether the Team Hub server exposes snippet storage routes.
   */
  probeSnippetsServiceEnabled(): Promise<boolean>;

  /**
   * Returns plugin catalog and trusted-publisher URLs configured on this Team Hub.
   */
  getPluginSources(): Promise<PluginSourcesResponse>;

  /**
   * Loads collection, environment, and LLM model options for admin user forms.
   */
  listAdminResourceOptions(): Promise<TeamHubAdminResourceOptions>;

  /**
   * Re-reads server.yaml on the Team Hub and applies reloadable config sections.
   *
   * Requires an admin-role bearer token. Returns a per-section report. A `400`
   * response with `fatalError` is returned as a normal result, not thrown.
   */
  reloadConfig(): Promise<ReloadConfigResponse>;

  /**
   * Lists all collections visible to the authenticated token.
   *
   * Admin tokens receive the full catalog from `GET /collections`; create, update,
   * and delete remain forbidden on the server.
   */
  listCollections(): Promise<CollectionRecord[]>;

  /**
   * Creates a new top-level collection.
   *
   * @param input - Display name for the collection.
   */
  createCollection(input: CreateCollectionInput): Promise<CollectionRecord>;

  /**
   * Updates an existing collection's settings.
   *
   * @param id - Collection UUID.
   * @param input - Updated collection fields.
   */
  updateCollection(id: string, input: UpdateCollectionInput): Promise<CollectionRecord>;

  /**
   * Deletes a collection and all nested folders and requests.
   *
   * @param id - Collection UUID.
   */
  deleteCollection(id: string): Promise<void>;

  /**
   * Lists all environments visible to the authenticated token.
   *
   * Admin tokens receive the full catalog from `GET /environments`; create, update,
   * and delete remain forbidden on the server.
   */
  listEnvironments(): Promise<EnvironmentRecord[]>;

  /**
   * Creates a new top-level environment.
   *
   * @param input - Display name for the environment.
   */
  createEnvironment(input: CreateEnvironmentInput): Promise<EnvironmentRecord>;

  /**
   * Updates an existing environment's name and variables.
   *
   * @param id - Environment UUID.
   * @param input - Updated environment fields.
   */
  updateEnvironment(id: string, input: UpdateEnvironmentInput): Promise<EnvironmentRecord>;

  /**
   * Deletes an environment by id.
   *
   * @param id - Environment UUID.
   */
  deleteEnvironment(id: string): Promise<void>;

  /**
   * Lists all snippets visible to the authenticated token.
   *
   * Admin tokens receive the full catalog from `GET /snippets`; create, update,
   * and delete remain forbidden on the server.
   */
  listSnippets(): Promise<SnippetRecord[]>;

  /**
   * Creates a new top-level snippet.
   *
   * @param input - Display name for the snippet.
   */
  createSnippet(input: CreateSnippetInput): Promise<SnippetRecord>;

  /**
   * Updates an existing snippet's name, code, and scope.
   *
   * @param id - Snippet UUID.
   * @param input - Updated snippet fields.
   */
  updateSnippet(id: string, input: UpdateSnippetInput): Promise<SnippetRecord>;

  /**
   * Deletes a snippet by id.
   *
   * @param id - Snippet UUID.
   */
  deleteSnippet(id: string): Promise<void>;

  /**
   * Lists run results saved by the authenticated user token.
   */
  listRunResults(): Promise<RunResultRecord[]>;

  /**
   * Saves a run result snapshot to the Team Hub.
   *
   * @param input - Optional label and HarborClient export payload.
   */
  createRunResult(input: CreateRunResultInput): Promise<RunResultDetail>;

  /**
   * Loads a run result snapshot by id.
   *
   * @param id - Run result UUID.
   */
  getRunResult(id: string): Promise<RunResultDetail>;

  /**
   * Deletes a run result saved by the authenticated user when permitted.
   *
   * @param id - Run result UUID.
   */
  deleteRunResult(id: string): Promise<void>;

  /**
   * Lists folders in a collection ordered by sort order, then name.
   *
   * @param collectionId - Parent collection UUID.
   */
  listFolders(collectionId: string): Promise<FolderRecord[]>;

  /**
   * Creates a folder in the given collection.
   *
   * @param collectionId - Parent collection UUID.
   * @param input - Display name for the folder.
   */
  createFolder(collectionId: string, input: CreateFolderInput): Promise<FolderRecord>;

  /**
   * Renames a folder by id.
   *
   * @param id - Folder UUID.
   * @param input - Updated folder name.
   */
  renameFolder(id: string, input: RenameFolderInput): Promise<FolderRecord>;

  /**
   * Deletes a folder and all saved requests inside it.
   *
   * @param id - Folder UUID.
   */
  deleteFolder(id: string): Promise<void>;

  /**
   * Reorders folders within a collection.
   *
   * @param collectionId - Parent collection UUID.
   * @param input - Folder ids in the desired order.
   */
  reorderFolders(collectionId: string, input: ReorderFoldersInput): Promise<void>;

  /**
   * Lists saved requests in a collection.
   *
   * @param collectionId - Parent collection UUID.
   */
  listRequests(collectionId: string): Promise<SavedRequestRecord[]>;

  /**
   * Creates a new saved request in a collection.
   *
   * @param collectionId - Parent collection UUID.
   * @param input - Saved request fields.
   */
  createRequest(collectionId: string, input: CreateRequestInput): Promise<SavedRequestRecord>;

  /**
   * Updates an existing saved request by id.
   *
   * @param id - Saved request UUID.
   * @param input - Updated request fields including collection id.
   */
  updateRequest(id: string, input: UpdateRequestInput): Promise<SavedRequestRecord>;

  /**
   * Deletes a saved request by id.
   *
   * @param id - Saved request UUID.
   */
  deleteRequest(id: string): Promise<void>;

  /**
   * Reorders saved requests within a folder or the collection root.
   *
   * @param collectionId - Parent collection UUID.
   * @param input - Destination folder and ordered request ids.
   */
  reorderRequests(collectionId: string, input: ReorderRequestsInput): Promise<void>;

  /**
   * Moves a saved request to another folder or root index.
   *
   * @param id - Saved request UUID.
   * @param input - Destination folder and target index.
   */
  moveRequest(id: string, input: MoveRequestInput): Promise<void>;
}
