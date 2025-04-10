export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			graphql: {
				Args: {
					operationName?: string
					query?: string
					variables?: Json
					extensions?: Json
				}
				Returns: Json
			}
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
	public: {
		Tables: {
			category: {
				Row: {
					created_at: string
					id: number
					name: string
					updated_at: string
					user_id: string
				}
				Insert: {
					created_at?: string
					id?: number
					name: string
					updated_at?: string
					user_id: string
				}
				Update: {
					created_at?: string
					id?: number
					name?: string
					updated_at?: string
					user_id?: string
				}
				Relationships: []
			}
			expense: {
				Row: {
					amount: number
					category_id: number | null
					created_at: string
					date: string
					description: string | null
					id: number
					source_id: number | null
					title: string
					updated_at: string
					user_id: string
				}
				Insert: {
					amount: number
					category_id?: number | null
					created_at?: string
					date: string
					description?: string | null
					id?: number
					source_id?: number | null
					title: string
					updated_at?: string
					user_id: string
				}
				Update: {
					amount?: number
					category_id?: number | null
					created_at?: string
					date?: string
					description?: string | null
					id?: number
					source_id?: number | null
					title?: string
					updated_at?: string
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: "expense_category_id_fkey"
						columns: ["category_id"]
						isOneToOne: false
						referencedRelation: "category"
						referencedColumns: ["id"]
					},
					{
						foreignKeyName: "expense_source_id_fkey"
						columns: ["source_id"]
						isOneToOne: false
						referencedRelation: "source"
						referencedColumns: ["id"]
					},
				]
			}
			feedback: {
				Row: {
					answer: string
					created_at: string
					id: number
					question: string
					rating: number
					updated_at: string
				}
				Insert: {
					answer: string
					created_at?: string
					id?: number
					question: string
					rating: number
					updated_at?: string
				}
				Update: {
					answer?: string
					created_at?: string
					id?: number
					question?: string
					rating?: number
					updated_at?: string
				}
				Relationships: []
			}
			source: {
				Row: {
					created_at: string
					id: number
					name: string
					updated_at: string
					user_id: string
				}
				Insert: {
					created_at?: string
					id?: number
					name: string
					updated_at?: string
					user_id: string
				}
				Update: {
					created_at?: string
					id?: number
					name?: string
					updated_at?: string
					user_id?: string
				}
				Relationships: []
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R
			}
			? R
			: never
		: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I
			}
			? I
			: never
		: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U
			}
			? U
			: never
		: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never

export const Constants = {
	graphql_public: {
		Enums: {},
	},
	public: {
		Enums: {},
	},
} as const
