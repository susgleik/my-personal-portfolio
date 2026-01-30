# Índice: posts - isPublished + publishedAt
resource "google_firestore_index" "posts_published" {
  project    = "personal-portfolio-66f9f"
  database   = "(default)"
  collection = "posts"

  fields {
    field_path = "isPublished"
    order      = "ASCENDING"
  }

  fields {
    field_path = "publishedAt"
    order      = "DESCENDING"
  }
}

# Índice: projects - order + createdAt
resource "google_firestore_index" "projects_order" {
  project    = "personal-portfolio-66f9f"
  database   = "(default)"
  collection = "projects"

  fields {
    field_path = "order"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

# Índice: projects - isPublished + order + createdAt
resource "google_firestore_index" "projects_published_order" {
  project    = "personal-portfolio-66f9f"
  database   = "(default)"
  collection = "projects"

  fields {
    field_path = "isPublished"
    order      = "ASCENDING"
  }

  fields {
    field_path = "order"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

# Índice: projects - featured + isPublished + order + createdAt
resource "google_firestore_index" "projects_featured_published" {
  project    = "personal-portfolio-66f9f"
  database   = "(default)"
  collection = "projects"

  fields {
    field_path = "featured"
    order      = "ASCENDING"
  }

  fields {
    field_path = "isPublished"
    order      = "ASCENDING"
  }

  fields {
    field_path = "order"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

# Índice: projects - featured + order + createdAt
resource "google_firestore_index" "projects_featured_order" {
  project    = "personal-portfolio-66f9f"
  database   = "(default)"
  collection = "projects"

  fields {
    field_path = "featured"
    order      = "ASCENDING"
  }

  fields {
    field_path = "order"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}

# Índice: projects - category + isPublished + order + createdAt
resource "google_firestore_index" "projects_category_published" {
  project    = "personal-portfolio-66f9f"
  database   = "(default)"
  collection = "projects"

  fields {
    field_path = "category"
    order      = "ASCENDING"
  }

  fields {
    field_path = "isPublished"
    order      = "ASCENDING"
  }

  fields {
    field_path = "order"
    order      = "ASCENDING"
  }

  fields {
    field_path = "createdAt"
    order      = "DESCENDING"
  }
}
