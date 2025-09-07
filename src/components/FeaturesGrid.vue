<template>
  <section class="features">
    <FeatureCard
      v-for="(feature, index) in features"
      :key="feature.id"
      :icon="feature.icon"
      :title="feature.title"
      :description="feature.description"
      :link="feature.link"
      :link-text="feature.linkText"
      :delay="index * 0.1"
    />
  </section>
</template>

<script>
export default {
  data() {
    return {
      features: [
        {
          id: 1,
          icon: '🎭',
          title: 'Rate & Review',
          description: 'Share your thoughts on every film you watch. Rate movies and write detailed reviews to help others discover great cinema.',
          link: '/reviews',
          linkText: 'Write Reviews'
        },
        {
          id: 2,
          icon: '📝',
          title: 'Create Lists',
          description: 'Organize your favorite films into custom lists. From "Best of 2024" to "Comfort Food Movies" - the possibilities are endless.',
          link: '/lists',
          linkText: 'Create Lists'
        },
        {
          id: 3,
          icon: '👥',
          title: 'Follow Friends',
          description: 'Connect with fellow film enthusiasts. See what your friends are watching and get personalized recommendations.',
          link: '/social',
          linkText: 'Find Friends'
        },
        // ... more features
      ]
    }
  }
}
</script>

<style>
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}
</style>
