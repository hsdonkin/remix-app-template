interface RewardVariation {
  display_order: number;
  quantity: number;
  reference_id?: string;
  color: string;
  size: string;
}

interface RewardExtraData {
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  [key: string]: any;
}

interface CreateRewardRequest {
  title: string;
  description: string;
  type: "STANDARD" | "SWEEPSTAKE" | "CODE" | "DOWNLOAD";
  category_id: number;
  points_to_redeem: number;
  total_quantity?: number;
  reference_id?: string;
  max_lifetime_redemptions?: number;
  is_shipping_required: boolean;
  is_phone_number_required: boolean;
  date_start: string;
  date_end?: string;
  freq_cap?: number;
  freq_period_id?: number;
  code_expiration?: number;
  segment_link_id?: number;
  segment_link_type?: "include" | "exclude";
  variations?: RewardVariation[];
  extra_data?: RewardExtraData;
  date_until_entries_accepted?: string;
  num_winners?: number;
  min_age?: number;
}

interface CreateRewardResponse {
  reward_ids: number[];
  reward_group_id: number;
}

interface CrowdTwistError {
  error: string;
  message: string;
}

interface PurchaseUserAttributes {
  email_address?: string;
  phone_number?: string;
  third_party_id?: string;
}

interface PurchaseTender {
  type: number;
  amount: number;
}

interface PurchaseItem {
  sku: string;
  price: number;
  quantity: number;
  transaction_id?: number;
  custom_data?: Record<string, any>;
}

interface PurchaseRequest {
  receipt_id: string;
  order_id?: string;
  user_id?: number;
  user_attributes?: PurchaseUserAttributes;
  total: number;
  subtotal?: number;
  date_purchased: string;
  custom_data?: Record<string, any>;
  tenders?: PurchaseTender[];
  channel_id?: number;
  coupons?: string[];
  currency?: string;
  receipt_image_id?: string;
  items: PurchaseItem[];
}

interface PurchaseCampaign {
  title: string;
  multiplier: number | null;
  point_gift: number | null;
}

interface PurchaseTransaction {
  name: string;
  proportion: number;
  multiplier: number;
}

interface PurchaseTenderResponse {
  name: string;
  proportion: number;
  multiplier: number;
}

interface PurchaseBreakdown {
  sku: string;
  is_awaiting_fulfillment?: boolean;
  quantity: number;
  item_price: number;
  points_to_dollar_conversion_rate: number;
  points_to_currency_conversion_rate?: number;
  converted_points: number;
  campaigns?: PurchaseCampaign[];
  transaction?: PurchaseTransaction[];
  tenders?: PurchaseTenderResponse[];
  points_awarded: number;
  is_excluded: boolean;
}

interface PurchaseResponse {
  receipt_id: number;
  user_id: number;
  total_points_awarded: number;
  bonus_points_awarded: number;
  points_awaiting_fulfillment: number;
  breakdown: PurchaseBreakdown[];
}

interface PurchaseError {
  system: string;
  reason: string;
  description: string;
  message: string;
}

interface ClaimPointsUserAttributes {
  email_address?: string;
  phone_number?: string;
  third_party_id?: string;
}

interface ClaimPointsRequest {
  third_party_receipt_id: string;
  user_id?: number;
  user_attributes?: ClaimPointsUserAttributes;
  order_id?: string;
  total?: number;
  store_location?: string;
  date_purchased?: string;
}

interface ClaimPointsResult {
  type?: string;
  third_party_id?: string;
  id?: string;
  date_occurred?: string;
  points_awarded: number;
  bonus_points_awarded: number;
}

interface ClaimPointsResponse {
  receipt_id: string;
  order_id: string;
  user_id: string;
  results: ClaimPointsResult[];
}

interface ClaimPointsError {
  system: string;
  reason: string;
  description: string;
  message: string;
}

interface ReturnUserAttributes {
  email_address?: string;
  phone_number?: string;
  third_party_id?: string;
}

interface ReturnItem {
  sku: string;
  quantity: number;
}

interface ReturnRequest {
  return_id: string;
  original_receipt_id?: string;
  return_type: number;
  date_returned: string;
  user_id?: number;
  user_attributes?: ReturnUserAttributes;
  custom_data?: Record<string, any>;
  items: ReturnItem[];
}

interface ReturnBreakdown {
  sku: string;
  points_deducted: number;
  date_points_awarded: string;
  points_awarded: number;
}

interface ReturnResponse {
  receipt_id: string;
  is_excluded: boolean;
  user_id: string;
  total_points_deducted: number;
  breakdown: ReturnBreakdown[];
}

interface ReturnError {
  system: string;
  reason: string;
  description: string;
  message: string;
}

interface UserPurchaseHistoryRequest {
  user_id: string;
  id_type?: "email" | "id" | "third_party_id" | "mobile_phone_number";
  page?: number;
  date_start?: string;
  date_end?: string;
}

interface UserPurchase {
  last_date_purchased: string;
  purchase_id: string;
  purchase_id_type: string;
  purchase_total: number;
  total_points_awarded: number;
  total_points_earned: number;
  points_awaiting_fulfillment?: number;
}

interface UserPurchaseHistoryPaging {
  total: number;
  pages: number;
  next_page: string;
  prev_page: string;
}

interface UserPurchaseHistoryResponse {
  purchases: UserPurchase[];
  paging: UserPurchaseHistoryPaging;
}

interface UserPurchaseHistoryError {
  error: {
    code: number;
    message: string;
    errors: Array<{
      reason: string;
      message: string;
    }>;
  };
}

class CrowdtwistApiClient {
  private baseUrl: string;
  private apiKey: string;
  private clientId: string;

  constructor(baseUrl: string, apiKey: string, clientId: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.clientId = clientId;
  }

  private getEndpoint(): string {
    return `${this.baseUrl}api${this.clientId}.crowdtwist.com/v2`;
  }

  private getPosEndpoint(): string {
    return `${this.baseUrl}pos${this.clientId}.crowdtwist.com`;
  }

  private async makeRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
  ): Promise<T> {
    const url = `${this.getEndpoint()}${endpoint}?api_key=${this.apiKey}`;

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (body && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData: CrowdTwistError = await response.json();
      throw new Error(
        `CrowdTwist API Error: ${errorData.error} - ${errorData.message}`,
      );
    }

    return response.json();
  }

  private async makePosRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
  ): Promise<T> {
    const url = `${this.getPosEndpoint()}${endpoint}`;

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-CT-Authorization": `CTApiKey ${this.apiKey}`,
      },
    };

    if (body && (method === "POST" || method === "PUT")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData: PurchaseError = await response.json();
      throw new Error(
        `CrowdTwist POS Error: ${errorData.reason} - ${errorData.message}`,
      );
    }

    return response.json();
  }

  async createReward(
    rewardData: CreateRewardRequest,
  ): Promise<CreateRewardResponse> {
    this.validateRewardData(rewardData);

    return this.makeRequest<CreateRewardResponse>(
      "/reward",
      "POST",
      rewardData,
    );
  }

  async createPurchase(
    purchaseData: PurchaseRequest,
  ): Promise<PurchaseResponse> {
    this.validatePurchaseData(purchaseData);

    return this.makePosRequest<PurchaseResponse>(
      "/purchase",
      "POST",
      purchaseData,
    );
  }

  async claimPoints(
    claimData: ClaimPointsRequest,
  ): Promise<ClaimPointsResponse> {
    this.validateClaimPointsData(claimData);

    return this.makePosRequest<ClaimPointsResponse>(
      "/claim",
      "POST",
      claimData,
    );
  }

  async createReturn(returnData: ReturnRequest): Promise<ReturnResponse> {
    this.validateReturnData(returnData);

    return this.makePosRequest<ReturnResponse>("/return", "POST", returnData);
  }

  async getUserPurchaseHistory(
    request: UserPurchaseHistoryRequest,
  ): Promise<UserPurchaseHistoryResponse> {
    this.validateUserPurchaseHistoryRequest(request);

    const queryParams = this.buildPurchaseHistoryQueryParams(request);
    const endpoint = `/users/${encodeURIComponent(request.user_id)}/purchases${queryParams}`;

    return this.makePosRequest<UserPurchaseHistoryResponse>(endpoint, "GET");
  }

  private validateRewardData(data: CreateRewardRequest): void {
    const requiredFields = [
      "title",
      "description",
      "type",
      "category_id",
      "points_to_redeem",
      "is_shipping_required",
      "is_phone_number_required",
      "date_start",
    ];

    for (const field of requiredFields) {
      if (
        data[field as keyof CreateRewardRequest] === undefined ||
        data[field as keyof CreateRewardRequest] === null
      ) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (data.type === "SWEEPSTAKE") {
      if (!data.date_end) {
        throw new Error("date_end is required for SWEEPSTAKE rewards");
      }
      if (!data.date_until_entries_accepted) {
        throw new Error(
          "date_until_entries_accepted is required for SWEEPSTAKE rewards",
        );
      }
      if (!data.num_winners) {
        throw new Error("num_winners is required for SWEEPSTAKE rewards");
      }
    }

    if (data.segment_link_id && !data.segment_link_type) {
      throw new Error(
        "segment_link_type is required when segment_link_id is provided",
      );
    }

    if (data.variations) {
      this.validateVariations(data.variations);
    }
  }

  private validateVariations(variations: RewardVariation[]): void {
    const combinations = new Set<string>();

    for (const variation of variations) {
      const combination = `${variation.color}-${variation.size}`.toLowerCase();
      if (combinations.has(combination)) {
        throw new Error(
          `Duplicate color and size combination: ${variation.color}, ${variation.size}`,
        );
      }
      combinations.add(combination);
    }
  }

  private validatePurchaseData(data: PurchaseRequest): void {
    const requiredFields = ["receipt_id", "total", "date_purchased", "items"];

    for (const field of requiredFields) {
      if (
        data[field as keyof PurchaseRequest] === undefined ||
        data[field as keyof PurchaseRequest] === null
      ) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!data.items || data.items.length === 0) {
      throw new Error("At least one item is required");
    }

    for (const item of data.items) {
      if (
        !item.sku ||
        item.price === undefined ||
        item.quantity === undefined
      ) {
        throw new Error("Each item must have sku, price, and quantity fields");
      }

      if (item.price < 0) {
        throw new Error("Item price cannot be negative");
      }

      if (item.quantity <= 0) {
        throw new Error("Item quantity must be greater than 0");
      }
    }

    if (data.total < 0) {
      throw new Error("Total amount cannot be negative");
    }

    if (data.subtotal !== undefined && data.subtotal < 0) {
      throw new Error("Subtotal cannot be negative");
    }

    if (data.tenders) {
      for (const tender of data.tenders) {
        if (tender.amount < 0) {
          throw new Error("Tender amount cannot be negative");
        }
      }
    }

    if (data.user_attributes) {
      const hasUserIdentifier =
        data.user_attributes.email_address ||
        data.user_attributes.phone_number ||
        data.user_attributes.third_party_id;

      if (!hasUserIdentifier && !data.user_id) {
        throw new Error(
          "Either user_id or at least one user attribute (email, phone, third_party_id) must be provided",
        );
      }
    } else if (!data.user_id) {
      throw new Error("Either user_id or user_attributes must be provided");
    }
  }

  private validateClaimPointsData(data: ClaimPointsRequest): void {
    if (!data.third_party_receipt_id) {
      throw new Error("third_party_receipt_id is required");
    }

    if (data.user_attributes) {
      const hasUserIdentifier =
        data.user_attributes.email_address ||
        data.user_attributes.phone_number ||
        data.user_attributes.third_party_id;

      if (!hasUserIdentifier && !data.user_id) {
        throw new Error(
          "Either user_id or at least one user attribute (email, phone, third_party_id) must be provided",
        );
      }
    } else if (!data.user_id) {
      throw new Error("Either user_id or user_attributes must be provided");
    }

    if (data.total !== undefined && data.total < 0) {
      throw new Error("Total cannot be negative");
    }
  }

  private validateReturnData(data: ReturnRequest): void {
    const requiredFields = [
      "return_id",
      "return_type",
      "date_returned",
      "items",
    ];

    for (const field of requiredFields) {
      if (
        data[field as keyof ReturnRequest] === undefined ||
        data[field as keyof ReturnRequest] === null
      ) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    if (!data.items || data.items.length === 0) {
      throw new Error("At least one item is required");
    }

    for (const item of data.items) {
      if (!item.sku || item.quantity === undefined) {
        throw new Error("Each item must have sku and quantity fields");
      }

      if (item.quantity <= 0) {
        throw new Error("Item quantity must be greater than 0");
      }
    }

    const returnTypesRequiringUser = [4, 5, 9];
    if (returnTypesRequiringUser.includes(data.return_type)) {
      if (data.user_attributes) {
        const hasUserIdentifier =
          data.user_attributes.email_address ||
          data.user_attributes.phone_number ||
          data.user_attributes.third_party_id;

        if (!hasUserIdentifier && !data.user_id) {
          throw new Error(
            "Return types 4, 5, and 9 require either user_id or at least one user attribute (email, phone, third_party_id)",
          );
        }
      } else if (!data.user_id) {
        throw new Error(
          "Return types 4, 5, and 9 require either user_id or user_attributes",
        );
      }
    }

    if (!data.original_receipt_id && !data.user_attributes && !data.user_id) {
      throw new Error(
        "Either original_receipt_id or user identification (user_id/user_attributes) must be provided",
      );
    }
  }

  private validateUserPurchaseHistoryRequest(
    data: UserPurchaseHistoryRequest,
  ): void {
    if (!data.user_id) {
      throw new Error("user_id is required");
    }

    if (data.page !== undefined && data.page < 1) {
      throw new Error("Page number must be greater than 0");
    }

    if (data.date_start && data.date_end) {
      const startDate = new Date(data.date_start);
      const endDate = new Date(data.date_end);
      if (startDate > endDate) {
        throw new Error("date_start cannot be after date_end");
      }
    }

    const validIdTypes = [
      "email",
      "id",
      "third_party_id",
      "mobile_phone_number",
    ];
    if (data.id_type && !validIdTypes.includes(data.id_type)) {
      throw new Error(
        `Invalid id_type. Must be one of: ${validIdTypes.join(", ")}`,
      );
    }
  }

  private buildPurchaseHistoryQueryParams(
    request: UserPurchaseHistoryRequest,
  ): string {
    const params = new URLSearchParams();

    if (request.id_type) {
      params.append("id_type", request.id_type);
    }

    if (request.page) {
      params.append("page", request.page.toString());
    }

    if (request.date_start) {
      params.append("date_start", request.date_start);
    }

    if (request.date_end) {
      params.append("date_end", request.date_end);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }
}

export {
  CrowdtwistApiClient,
  type CreateRewardRequest,
  type CreateRewardResponse,
  type RewardVariation,
  type RewardExtraData,
  type PurchaseRequest,
  type PurchaseResponse,
  type PurchaseUserAttributes,
  type PurchaseTender,
  type PurchaseItem,
  type PurchaseBreakdown,
  type PurchaseCampaign,
  type PurchaseTransaction,
  type PurchaseTenderResponse,
  type ClaimPointsRequest,
  type ClaimPointsResponse,
  type ClaimPointsUserAttributes,
  type ClaimPointsResult,
  type ReturnRequest,
  type ReturnResponse,
  type ReturnUserAttributes,
  type ReturnItem,
  type ReturnBreakdown,
  type UserPurchaseHistoryRequest,
  type UserPurchaseHistoryResponse,
  type UserPurchase,
  type UserPurchaseHistoryPaging,
};
