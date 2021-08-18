import { postUserConfig } from "api/ApiCalls"
import { FavoriteType } from "components/account/favorites/Favorites"
import { UserType } from "types/Types"

export const handleMetricStarClick = (
  id: string,
  name: string,
  user: UserType,
  updateUser: (u: UserType) => void
) => {
  const prevConfig = user.config ? user.config : {}
  const prevFavorites: { id: string; name: string }[] =
    prevConfig.favorites?.metrics || []
  let newFavorites = []
  if (prevFavorites.findIndex((item) => item.id === id) !== -1) {
    newFavorites = prevFavorites.filter((item) => item.id !== id)
  } else {
    newFavorites = [...prevFavorites, { id, name }]
  }

  const newConfig = {
    ...prevConfig,
    favorites: { ...prevConfig.favorites, metrics: newFavorites },
  }

  postUserConfig(newConfig).then((res) => {
    updateUser({ ...user, config: newConfig })
  })
}

export const getMetricFavorites = (user: UserType) =>
  user.config?.favorites?.metrics?.map((p: FavoriteType) => p.id) || []
