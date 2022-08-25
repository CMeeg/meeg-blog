#!/usr/bin/env ts-node

import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs-extra'
import { packageDirectory } from 'pkg-dir'
import * as dotenv from 'dotenv'

// Promisify exec so we can use async/await instead of callbacks
const execAsync = promisify(exec)

interface IExecResult {
  success: boolean
  message: string
}

const execCmd = async (cmd: string): Promise<IExecResult> => {
  try {
    const result = await execAsync(cmd)

    if (result.stderr) {
      return {
        success: false,
        message: result.stderr
      }
    }

    return {
      success: true,
      message: result.stdout
    }
  } catch (error) {
    // https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
    let message
    if (error instanceof Error) {
      message = error.message
    } else {
      message = String(error)
    }

    return {
      success: false,
      message
    }
  }
}

const execPullStoryblokComponents = async (spaceId: string) => {
  return await execCmd(`storyblok pull-components --space ${spaceId}`)
}

const moveStoryblokSchemaFile = async (
  schemaType: StoryblokSchemaType,
  options: SchemaOptions
) => {
  const schema = schemaType.toLowerCase()
  const srcFilename = `${schema}.${options.spaceId}.json`
  const src = path.join(options.rootDir, srcFilename)
  const destDir = path.join(options.rootDir, options.schemasDir)
  const destFilename = `${schema}.json`
  const dest = path.join(destDir, destFilename)

  await fs.ensureDir(destDir)

  await fs.move(src, dest, {
    overwrite: true
  })

  return dest
}

const execGenStoryblokTypes = async (
  componentsSchemaPath: string,
  options: TypeOptions
) => {
  const targetDir = path.join(options.rootDir, options.typesDir)

  await fs.ensureDir(targetDir)

  const target = path.join(targetDir, options.typesFilename)

  const result = await execCmd(
    `storyblok-generate-ts source="${componentsSchemaPath}" target="${target}"`
  )

  // There is no success message from the process so we will add one if necessary!

  if (result.success && !result.message) {
    result.message = `Types created at: '${target}'`
  }

  return result
}

const generateTypes = async (
  options: GenTypesOptions
): Promise<IExecResult> => {
  console.log('Pulling Storyblok schemas')

  const pullComponentsResult = await execPullStoryblokComponents(
    options.spaceId
  )

  if (!pullComponentsResult.success) {
    return pullComponentsResult
  }

  const componentsSchemaPath = await moveStoryblokSchemaFile(
    StoryblokSchema.Components,
    options
  )

  console.log(
    `'${StoryblokSchema.Components} schema moved to: '${componentsSchemaPath}'`
  )

  const presetsSchemaPath = await moveStoryblokSchemaFile(
    StoryblokSchema.Presets,
    options
  )

  console.log(
    `'${StoryblokSchema.Presets} schema moved to: '${presetsSchemaPath}'`
  )

  console.log('Generating types from Storyblok components schema')

  const genTypesResult = await execGenStoryblokTypes(
    componentsSchemaPath,
    options
  )

  return genTypesResult
}

// Generate types

// Find closest dir containing 'package.json' - we will consider this out "root"
const pkgDir = await packageDirectory()

if (!pkgDir) {
  throw Error(`Could not locate 'package.json'. Exiting.`)
}

// Load env vars
const envFilePath = path.join(pkgDir, '.env.local')

dotenv.config({ path: envFilePath })

// Try get Storyblok Space ID from env file
const spaceId = process.env.STORYBLOK_SPACE_ID

if (!spaceId) {
  throw Error(`'STORYBLOK_SPACE_ID' not found in env file: '${envFilePath}'`)
}

// Configure options and run the function
const options = {
  spaceId,
  rootDir: pkgDir,
  schemasDir: 'src/features/storyblok/schemas',
  typesDir: 'src/features/storyblok/types',
  typesFilename: 'components.d.ts'
}

const enum StoryblokSchema {
  Components = 'Components',
  Presets = 'Presets'
}

type StoryblokSchemaType = keyof typeof StoryblokSchema

type SchemaOptions = {
  spaceId: string
  rootDir: string
  schemasDir: string
}

type TypeOptions = {
  rootDir: string
  typesDir: string
  typesFilename: string
}

type GenTypesOptions = SchemaOptions & TypeOptions

generateTypes(options).then((result) => {
  if (result.success) {
    console.log(result.message)
  } else {
    console.error(result.message)
  }
})
