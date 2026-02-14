import type { CollectionConfig } from 'payload'

import { anyone } from '@/payload/access/anyone'
import { isHidden } from '@/payload/access/isHidden'
import { isSuperAdmin, isSuperAdminFieldAccess } from '@/payload/access/isSuperAdmin'
import { generateForgotPasswordEmail } from '@/payload/email/generateForgotPasswordEmail'
import { generateVerificationEmail } from '@/payload/email/generateVerificationEmail'
import { tenantsArrayField } from '@payloadcms/plugin-multi-tenant/fields'
import { authenticated, isAuthenticatedFieldAccess } from '../../access/authenticated'
import { resendVerificationHandler } from './endpoints/resendVerification'

const defaultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: 'tenants',
  tenantsCollectionSlug: 'tenants',
  tenantsArrayTenantFieldName: 'tenant',
  arrayFieldAccess: {
    read: ({ req }) => {
      return true
    },
    create: isSuperAdminFieldAccess,
    update: isSuperAdminFieldAccess,
  },
  tenantFieldAccess: {
    read: isAuthenticatedFieldAccess,
    create: isSuperAdminFieldAccess,
    update: isSuperAdminFieldAccess,
  },
  rowFields: [
    {
      name: 'roles',
      type: 'select',
      defaultValue: ['tenant-viewer'],
      hasMany: true,
      options: ['tenant-admin', 'tenant-viewer'],
      required: true,
      saveToJWT: true,
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
      options: ['super-admin', 'admin', 'user', 'content-editor'],
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
      maxRows: 1,
      access: {
        read: isAuthenticatedFieldAccess,
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
