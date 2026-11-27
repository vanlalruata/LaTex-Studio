import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import contact50a660 from './contact'
/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
export const features = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: features.url(options),
    method: 'get',
})

features.definition = {
    methods: ["get","head"],
    url: '/features',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
features.url = (options?: RouteQueryOptions) => {
    return features.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
features.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: features.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
features.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: features.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
const featuresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: features.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
featuresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: features.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\FeatureController::__invoke
* @see app/Http/Controllers/PublicSite/FeatureController.php:12
* @route '/features'
*/
featuresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: features.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

features.form = featuresForm

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
export const howItWorks = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: howItWorks.url(options),
    method: 'get',
})

howItWorks.definition = {
    methods: ["get","head"],
    url: '/how-it-works',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
howItWorks.url = (options?: RouteQueryOptions) => {
    return howItWorks.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
howItWorks.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: howItWorks.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
howItWorks.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: howItWorks.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
const howItWorksForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: howItWorks.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
howItWorksForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: howItWorks.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\HowItWorksController::__invoke
* @see app/Http/Controllers/PublicSite/HowItWorksController.php:11
* @route '/how-it-works'
*/
howItWorksForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: howItWorks.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

howItWorks.form = howItWorksForm

/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
* @see app/Http/Controllers/PublicSite/DemoController.php:11
* @route '/demo'
*/
export const demo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: demo.url(options),
    method: 'get',
})

demo.definition = {
    methods: ["get","head"],
    url: '/demo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
* @see app/Http/Controllers/PublicSite/DemoController.php:11
* @route '/demo'
*/
demo.url = (options?: RouteQueryOptions) => {
    return demo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
* @see app/Http/Controllers/PublicSite/DemoController.php:11
* @route '/demo'
*/
demo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: demo.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
* @see app/Http/Controllers/PublicSite/DemoController.php:11
* @route '/demo'
*/
demo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: demo.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
* @see app/Http/Controllers/PublicSite/DemoController.php:11
* @route '/demo'
*/
const demoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: demo.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
* @see app/Http/Controllers/PublicSite/DemoController.php:11
* @route '/demo'
*/
demoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: demo.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\DemoController::__invoke
* @see app/Http/Controllers/PublicSite/DemoController.php:11
* @route '/demo'
*/
demoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: demo.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

demo.form = demoForm

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
export const templates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

templates.definition = {
    methods: ["get","head"],
    url: '/templates',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
templates.url = (options?: RouteQueryOptions) => {
    return templates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
templates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
templates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: templates.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
const templatesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
templatesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\TemplateController::__invoke
* @see app/Http/Controllers/PublicSite/TemplateController.php:12
* @route '/templates'
*/
templatesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: templates.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

templates.form = templatesForm

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
export const pricing = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pricing.url(options),
    method: 'get',
})

pricing.definition = {
    methods: ["get","head"],
    url: '/pricing',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
pricing.url = (options?: RouteQueryOptions) => {
    return pricing.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
pricing.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pricing.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
pricing.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pricing.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
const pricingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pricing.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
pricingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pricing.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\PricingController::__invoke
* @see app/Http/Controllers/PublicSite/PricingController.php:12
* @route '/pricing'
*/
pricingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pricing.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pricing.form = pricingForm

/**
* @see \App\Http\Controllers\PublicSite\AboutController::__invoke
* @see app/Http/Controllers/PublicSite/AboutController.php:11
* @route '/about'
*/
export const about = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})

about.definition = {
    methods: ["get","head"],
    url: '/about',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\AboutController::__invoke
* @see app/Http/Controllers/PublicSite/AboutController.php:11
* @route '/about'
*/
about.url = (options?: RouteQueryOptions) => {
    return about.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\AboutController::__invoke
* @see app/Http/Controllers/PublicSite/AboutController.php:11
* @route '/about'
*/
about.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: about.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\AboutController::__invoke
* @see app/Http/Controllers/PublicSite/AboutController.php:11
* @route '/about'
*/
about.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: about.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\AboutController::__invoke
* @see app/Http/Controllers/PublicSite/AboutController.php:11
* @route '/about'
*/
const aboutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: about.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\AboutController::__invoke
* @see app/Http/Controllers/PublicSite/AboutController.php:11
* @route '/about'
*/
aboutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: about.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\AboutController::__invoke
* @see app/Http/Controllers/PublicSite/AboutController.php:11
* @route '/about'
*/
aboutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: about.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

about.form = aboutForm

/**
* @see \App\Http\Controllers\PublicSite\ContactController::contact
* @see app/Http/Controllers/PublicSite/ContactController.php:17
* @route '/contact'
*/
export const contact = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})

contact.definition = {
    methods: ["get","head"],
    url: '/contact',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\ContactController::contact
* @see app/Http/Controllers/PublicSite/ContactController.php:17
* @route '/contact'
*/
contact.url = (options?: RouteQueryOptions) => {
    return contact.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\ContactController::contact
* @see app/Http/Controllers/PublicSite/ContactController.php:17
* @route '/contact'
*/
contact.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contact.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\ContactController::contact
* @see app/Http/Controllers/PublicSite/ContactController.php:17
* @route '/contact'
*/
contact.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contact.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\ContactController::contact
* @see app/Http/Controllers/PublicSite/ContactController.php:17
* @route '/contact'
*/
const contactForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contact.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\ContactController::contact
* @see app/Http/Controllers/PublicSite/ContactController.php:17
* @route '/contact'
*/
contactForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contact.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\ContactController::contact
* @see app/Http/Controllers/PublicSite/ContactController.php:17
* @route '/contact'
*/
contactForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contact.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

contact.form = contactForm

/**
* @see \App\Http\Controllers\PublicSite\FaqController::__invoke
* @see app/Http/Controllers/PublicSite/FaqController.php:12
* @route '/faq'
*/
export const faq = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: faq.url(options),
    method: 'get',
})

faq.definition = {
    methods: ["get","head"],
    url: '/faq',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\FaqController::__invoke
* @see app/Http/Controllers/PublicSite/FaqController.php:12
* @route '/faq'
*/
faq.url = (options?: RouteQueryOptions) => {
    return faq.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\FaqController::__invoke
* @see app/Http/Controllers/PublicSite/FaqController.php:12
* @route '/faq'
*/
faq.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: faq.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\FaqController::__invoke
* @see app/Http/Controllers/PublicSite/FaqController.php:12
* @route '/faq'
*/
faq.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: faq.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\FaqController::__invoke
* @see app/Http/Controllers/PublicSite/FaqController.php:12
* @route '/faq'
*/
const faqForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: faq.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\FaqController::__invoke
* @see app/Http/Controllers/PublicSite/FaqController.php:12
* @route '/faq'
*/
faqForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: faq.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\FaqController::__invoke
* @see app/Http/Controllers/PublicSite/FaqController.php:12
* @route '/faq'
*/
faqForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: faq.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

faq.form = faqForm

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
export const privacy = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})

privacy.definition = {
    methods: ["get","head"],
    url: '/privacy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacy.url = (options?: RouteQueryOptions) => {
    return privacy.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacy.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: privacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacy.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: privacy.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
const privacyForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacyForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacy.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::privacy
* @see app/Http/Controllers/PublicSite/LegalController.php:11
* @route '/privacy'
*/
privacyForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: privacy.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

privacy.form = privacyForm

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
export const terms = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})

terms.definition = {
    methods: ["get","head"],
    url: '/terms',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
terms.url = (options?: RouteQueryOptions) => {
    return terms.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
terms.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: terms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
terms.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: terms.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
const termsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: terms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
termsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: terms.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\LegalController::terms
* @see app/Http/Controllers/PublicSite/LegalController.php:16
* @route '/terms'
*/
termsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: terms.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

terms.form = termsForm

/**
* @see \App\Http\Controllers\PublicSite\SitemapController::__invoke
* @see app/Http/Controllers/PublicSite/SitemapController.php:11
* @route '/sitemap.xml'
*/
export const sitemap = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sitemap.url(options),
    method: 'get',
})

sitemap.definition = {
    methods: ["get","head"],
    url: '/sitemap.xml',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicSite\SitemapController::__invoke
* @see app/Http/Controllers/PublicSite/SitemapController.php:11
* @route '/sitemap.xml'
*/
sitemap.url = (options?: RouteQueryOptions) => {
    return sitemap.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicSite\SitemapController::__invoke
* @see app/Http/Controllers/PublicSite/SitemapController.php:11
* @route '/sitemap.xml'
*/
sitemap.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: sitemap.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\SitemapController::__invoke
* @see app/Http/Controllers/PublicSite/SitemapController.php:11
* @route '/sitemap.xml'
*/
sitemap.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: sitemap.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicSite\SitemapController::__invoke
* @see app/Http/Controllers/PublicSite/SitemapController.php:11
* @route '/sitemap.xml'
*/
const sitemapForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sitemap.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\SitemapController::__invoke
* @see app/Http/Controllers/PublicSite/SitemapController.php:11
* @route '/sitemap.xml'
*/
sitemapForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sitemap.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicSite\SitemapController::__invoke
* @see app/Http/Controllers/PublicSite/SitemapController.php:11
* @route '/sitemap.xml'
*/
sitemapForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: sitemap.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

sitemap.form = sitemapForm

const publicMethod = {
    features: Object.assign(features, features),
    howItWorks: Object.assign(howItWorks, howItWorks),
    demo: Object.assign(demo, demo),
    templates: Object.assign(templates, templates),
    pricing: Object.assign(pricing, pricing),
    about: Object.assign(about, about),
    contact: Object.assign(contact, contact50a660),
    faq: Object.assign(faq, faq),
    privacy: Object.assign(privacy, privacy),
    terms: Object.assign(terms, terms),
    sitemap: Object.assign(sitemap, sitemap),
}

export default publicMethod