import axios from "axios"

type JsonRpcParams = {
  service: "common" | "object"
  method: string
  args: any[]
}

const ODOO_URL = (process.env.ODOO_URL || "").replace(/\/+$/, "")
const ODOO_DB = process.env.ODOO_DB
const ODOO_USERNAME = process.env.ODOO_USERNAME
const ODOO_PASSWORD = process.env.ODOO_PASSWORD

function assertEnv() {
  if (!ODOO_URL || !ODOO_DB || !ODOO_USERNAME || !ODOO_PASSWORD) {
    throw new Error("Missing Odoo env vars: ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD")
  }
}

async function jsonRpcCall<T>(params: JsonRpcParams): Promise<T> {
  assertEnv()
  const url = `${ODOO_URL}/jsonrpc`
  const started = Date.now()
  try {
    const res = await axios.post(
      url,
      { jsonrpc: "2.0", method: "call", params, id: 1 },
      {
        timeout: 15000,
        headers: { "Content-Type": "application/json" },
        validateStatus: (s) => s < 500,
      },
    )

    const duration = Date.now() - started
    if (res.status >= 400) {
      console.error("Odoo HTTP error", { status: res.status, data: res.data, duration })
      throw new Error(`Odoo HTTP ${res.status}`)
    }

    if (res.data?.error) {
      console.error("Odoo RPC error", { error: res.data.error, duration })
      throw new Error(`Odoo RPC Error: ${JSON.stringify(res.data.error)}`)
    }

    console.log("Odoo RPC success", { method: params.method, service: params.service, duration })
    return res.data.result as T
  } catch (err: any) {
    const duration = Date.now() - started
    if (err?.response) {
      console.error("Odoo RPC failed", {
        status: err.response.status,
        data: err.response.data,
        duration,
      })
    } else {
      console.error("Odoo RPC failed", {
        message: err?.message,
        stack: err?.stack,
        duration,
      })
    }
    throw err
  }
}

export async function odooAuthenticate(): Promise<number> {
  const uid = await jsonRpcCall<number>({
    service: "common",
    method: "authenticate",
    args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
  })
  if (!uid) throw new Error("Odoo authentication failed")
  return uid
}

async function executeKw<T>(
  uid: number,
  model: string,
  method: string,
  args: any[] = [],
  kwargs: Record<string, any> = {}
): Promise<T> {
  return jsonRpcCall<T>({
    service: "object",
    method: "execute_kw",
    args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs],
  })
}

// Try a model, and if it fails due to RPC error, optionally try a fallback model
async function tryModel<T>(
  fn: (model: string) => Promise<T>,
  primary: string,
  fallback?: string
): Promise<T> {
  try {
    return await fn(primary)
  } catch (e) {
    if (fallback) {
      return await fn(fallback)
    }
    throw e
  }
}

export async function ensureTag(uid: number, tagName: string): Promise<number> {
  const resolve = async (model: string) => {
    const ids = await executeKw<number[]>(uid, model, "search", [[["name", "=", tagName]]], { limit: 1 })
    if (ids.length > 0) return ids[0]
    const id = await executeKw<number>(uid, model, "create", [{ name: tagName }])
    return id
  }
  // Primary model for newer Odoo; fallback for older versions
  return tryModel(resolve, "crm.tag", "crm.lead.tag")
}

export async function ensurePartner(uid: number, email: string, name: string): Promise<number> {
  const ids = await executeKw<number[]>(uid, "res.partner", "search", [[["email", "=", email]]], { limit: 1 })
  if (ids.length > 0) return ids[0]
  return executeKw<number>(uid, "res.partner", "create", [{ name, email }])
}

export async function createLead(uid: number, leadData: Record<string, any>): Promise<number> {
  return executeKw<number>(uid, "crm.lead", "create", [leadData])
}

export async function postNote(uid: number, leadId: number, noteText: string): Promise<void> {
  await executeKw(uid, "crm.lead", "message_post", [[leadId]], {
    body: noteText,
    message_type: "comment",
    subtype_xmlid: "mail.mt_note",
  })
}


