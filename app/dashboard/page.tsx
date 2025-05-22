"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchProjects, updateProject, createProject, deleteProject } from "@/lib/api"
import { useAuth } from "@/components/auth-provider"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Plus, Trash2, Search, ArrowUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast"
import { Navigation } from "@/components/navigation"

interface Project {
  id: string
  name: string
  description: string
  status: string
  created_at: string
  user_id: string
}

interface ProjectFormData {
  name: string
  description: string
  status: string
}

interface FormErrors {
  name?: string
  description?: string
  status?: string
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800"
    case "completed":
      return "bg-blue-100 text-blue-800"
    case "archived":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: isAuthLoading, userInfo } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    description: "",
    status: "active",
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const hasFetched = useRef(false)
  const [toast, setToast] = useState<{
    title: string
    description: string
    variant: "default" | "success" | "warning" | "error" | "info"
  } | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name-asc" | "name-desc">("newest")
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      // Prevent duplicate fetches
      if (hasFetched.current) {
        return
      }
      hasFetched.current = true

      try {
        const projects = await fetchProjects()
        setProjects(projects)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!isAuthLoading) {
      loadData()
    }
  }, [isAuthLoading, isAuthenticated, router])

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    let isValid = true

    if (!formData.name.trim()) {
      errors.name = "Name is required"
      isValid = false
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required"
      isValid = false
    }

    if (!formData.status) {
      errors.status = "Status is required"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  const handleEditClick = (project: Project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description,
      status: project.status,
    })
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const handleFormChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const handleSave = async () => {
    if (!editingProject || !validateForm()) return

    setIsSaving(true)
    try {
      const updatedProject = await updateProject(editingProject.id, formData)
      setProjects(prev => 
        prev.map(p => p.id === editingProject.id ? updatedProject : p)
      )
      setEditingProject(null)
      setIsDialogOpen(false)
      setFormErrors({})
      setToast({
        title: "Project Updated",
        description: "Your project has been successfully updated.",
        variant: "success"
      })
    } catch (error) {
      console.error("Error updating project:", error)
      setToast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "error"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateProject = async () => {
    if (!validateForm()) return

    setIsCreating(true)
    try {
      const newProject = await createProject(formData)
      setProjects(prev => [...prev, newProject])
      setFormData({
        name: "",
        description: "",
        status: "active",
      })
      setFormErrors({})
      setIsCreateDialogOpen(false)
      setToast({
        title: "Project Created",
        description: "Your new project has been successfully created.",
        variant: "success"
      })
    } catch (error) {
      console.error("Error creating project:", error)
      setToast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "error"
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return

    setIsDeleting(true)
    try {
      await deleteProject(projectToDelete.id)
      setProjects(prev => prev.filter(p => p.id !== projectToDelete.id))
      setIsDeleteDialogOpen(false)
      setProjectToDelete(null)
      setToast({
        title: "Project Deleted",
        description: "The project has been successfully deleted.",
        variant: "success"
      })
    } catch (error) {
      console.error("Error deleting project:", error)
      setToast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "error"
      })
    } finally {
      setIsDeleting(false)
    }
  }

  // Filter and sort projects
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || project.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ToastProvider>
      <div className="flex min-h-screen">
        <Navigation />
        <div className="flex-1 md:ml-[240px]">
          <Header />
          <main className="container py-8">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>User Profile</CardTitle>
                      <CardDescription>Your account information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {userInfo ? (
                        <div className="space-y-2">
                          <p>
                            <strong>Name:</strong> {userInfo.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {userInfo.email}
                          </p>
                          <p>
                            <strong>Role:</strong> {userInfo.role}
                          </p>
                        </div>
                      ) : (
                        <p>No user data available</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Activity</CardTitle>
                      <CardDescription>Your recent activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>No recent activity</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Statistics</CardTitle>
                      <CardDescription>Your usage statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>No statistics available</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="projects">
                <div className="space-y-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search projects..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">Newest First</SelectItem>
                          <SelectItem value="oldest">Oldest First</SelectItem>
                          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="mr-2 h-4 w-4" />
                          New Project
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create New Project</DialogTitle>
                          <DialogDescription>
                            Add a new project to your dashboard.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="new-name">Name</Label>
                            <Input
                              id="new-name"
                              value={formData.name}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange("name", e.target.value)}
                              className={cn(formErrors.name && "border-red-500")}
                            />
                            {formErrors.name && (
                              <p className="text-sm text-red-500">{formErrors.name}</p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="new-description">Description</Label>
                            <Textarea
                              id="new-description"
                              value={formData.description}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFormChange("description", e.target.value)}
                              className={cn(formErrors.description && "border-red-500")}
                            />
                            {formErrors.description && (
                              <p className="text-sm text-red-500">{formErrors.description}</p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="new-status">Status</Label>
                            <Select
                              value={formData.status}
                              onValueChange={(value: string) => handleFormChange("status", value)}
                            >
                              <SelectTrigger className={cn(formErrors.status && "border-red-500")}>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            {formErrors.status && (
                              <p className="text-sm text-red-500">{formErrors.status}</p>
                            )}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleCreateProject} disabled={isCreating}>
                            {isCreating ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              "Create Project"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredAndSortedProjects.length > 0 ? (
                      filteredAndSortedProjects.map((project) => (
                        <Card key={project.id}>
                          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div>
                              <CardTitle>{project.name}</CardTitle>
                              <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                            </div>
                            <div className="flex gap-1">
                              <Dialog open={isDialogOpen && editingProject?.id === project.id} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 -mt-1"
                                    onClick={() => handleEditClick(project)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Project</DialogTitle>
                                    <DialogDescription>
                                      Make changes to your project here. Click save when you're done.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="name">Name</Label>
                                      <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFormChange("name", e.target.value)}
                                        className={cn(formErrors.name && "border-red-500")}
                                      />
                                      {formErrors.name && (
                                        <p className="text-sm text-red-500">{formErrors.name}</p>
                                      )}
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="description">Description</Label>
                                      <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleFormChange("description", e.target.value)}
                                        className={cn(formErrors.description && "border-red-500")}
                                      />
                                      {formErrors.description && (
                                        <p className="text-sm text-red-500">{formErrors.description}</p>
                                      )}
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="status">Status</Label>
                                      <Select
                                        value={formData.status}
                                        onValueChange={(value: string) => handleFormChange("status", value)}
                                      >
                                        <SelectTrigger className={cn(formErrors.status && "border-red-500")}>
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="active">Active</SelectItem>
                                          <SelectItem value="completed">Completed</SelectItem>
                                          <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      {formErrors.status && (
                                        <p className="text-sm text-red-500">{formErrors.status}</p>
                                      )}
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={handleSave} disabled={isSaving}>
                                      {isSaving ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Saving...
                                        </>
                                      ) : (
                                        "Save changes"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              {project.user_id === userInfo?.id && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 -mt-1 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteClick(project)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Status:</span>
                              <span className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                getStatusColor(project.status)
                              )}>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </span>
                            </div>
                            <p className="mt-2">
                              <strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card className="col-span-full">
                        <CardHeader>
                          <CardTitle>No Projects Found</CardTitle>
                          <CardDescription>
                            {searchQuery || statusFilter !== "all"
                              ? "No projects match your search criteria."
                              : "You don't have any projects yet."}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center justify-center space-y-4 py-8">
                            <div className="rounded-full bg-muted p-4">
                              <Plus className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <p className="text-center text-muted-foreground">
                              {searchQuery || statusFilter !== "all"
                                ? "Try adjusting your search or filters"
                                : "Create your first project to get started"}
                            </p>
                            <Button onClick={() => setIsCreateDialogOpen(true)}>
                              <Plus className="mr-2 h-4 w-4" />
                              Create Project
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Settings options will be available here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setProjectToDelete(null)
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {toast && (
        <Toast variant={toast.variant}>
          <ToastTitle>{toast.title}</ToastTitle>
          <ToastDescription>{toast.description}</ToastDescription>
          <ToastClose onClick={() => setToast(null)} />
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  )
}
