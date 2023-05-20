import { Text, TouchableOpacity, View } from 'react-native'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'

import * as SecureStore from 'expo-secure-store'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'

import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { api } from '../src/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/0271ec668634482c2fff',
}

export default function App() {
  const router = useRouter()

  const [, response, singInWithGithub] = useAuthRequest(
    {
      clientId: '0271ec668634482c2fff',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  async function storeJWT(code: string) {
    const res = await api.post('/register', {
      code,
    })

    const { token } = res.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params

      storeJWT(code)
    }
  }, [response])

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="font-tile text-center text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => singInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-small text-center font-body leading-relaxed text-gray-500">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
