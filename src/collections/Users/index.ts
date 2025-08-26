import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { anyone } from '@/access/anyone'

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
})

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: anyone,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'username',
      required: true,
      unique: true,
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      defaultValue: 'user',
      hasMany: true,
      options: ['super-admin', 'tenant-admin', 'user'],
      admin: {
        position: 'sidebar',
      },
    },
    {
      ...defaultTenantArrayField,
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
