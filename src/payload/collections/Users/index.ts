import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { anyone } from '@/payload/access/anyone'
import { isSuperAdmin, isSuperAdminFieldAccess } from '@/payload/access/isSuperAdmin'
import { isHidden } from '@/payload/access/isHidden'
import { generateForgotPasswordEmail } from '@/payload/email/generateForgotPasswordEmail'
import { generateVerificationEmail } from '@/payload/email/generateVerificationEmail'
import { resendVerificationHandler } from './endpoints/resendVerification'

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
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['tenant-viewer'],
      hasMany: true,
      options: ['tenant-admin', 'tenant-viewer'],
      required: true,
    },
  ],
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
    hidden: ({ user }) => !isHidden(user),
  },
  auth: {
    forgotPassword: {
      generateEmailHTML: generateForgotPasswordEmail,
      generateEmailSubject: () => 'Reset your password',
    },
    verify: {
      generateEmailHTML: generateVerificationEmail,
      generateEmailSubject: () => 'Подтвердите вашу почту',
    },
  },
  endpoints: [resendVerificationHandler],
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
      defaultValue: () => ['user'],
      hasMany: true,
      options: ['super-admin', 'user', 'content-editor'],
      access: {
        update: ({ req }) => {
          return isSuperAdmin(req.user)
        },
      },
      admin: {
        position: 'sidebar',
      },
    },
    {
      ...defaultTenantArrayField,
      access: {
        read: isSuperAdminFieldAccess,
        update: isSuperAdminFieldAccess,
        create: isSuperAdminFieldAccess,
      },
      admin: {
        ...(defaultTenantArrayField?.admin || {}),
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
