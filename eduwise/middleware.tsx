export { default } from 'next-auth/middleware'

// example
// that mean to be able to use /example, you need to be authenticated
export const config = {
    matcher: [ "/example"]
}