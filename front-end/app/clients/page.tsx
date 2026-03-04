import ClientsSections from "@/components/clients-sections"
import { clientPartnerApi } from "@/lib/api"

type ClientItem = {
  clientId: number
  name: string
  category: "client" | "partner"
  logoUrl: string | null
  description: string | null
}

export default async function ClientsPage() {
  let rows: ClientItem[] = []
  try {
    const dbRows = await clientPartnerApi.getAll()
    rows = dbRows.map((row) => ({
      clientId: row.clientId,
      name: row.name,
      category: row.category?.toLowerCase() === "partner" ? "partner" : "client",
      logoUrl: row.logoUrl,
      description: row.description,
    }))
  } catch {
    rows = []
  }

  return <ClientsSections rows={rows} />
}

